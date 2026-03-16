const fs = require("fs");
const path = require("path");

const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const express = require("express");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const jwtSecret = process.env.JWT_SECRET;
const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;
const cookieSecure = process.env.COOKIE_SECURE === "true";
const cookieSameSite = cookieSecure ? "none" : "lax";
const tokenLifetime = "12h";
const dataDir = path.join(__dirname, "data");
const dataFilePath = path.join(dataDir, "store.json");
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!jwtSecret || !adminUsername || !adminPassword) {
  throw new Error(
    "Missing required environment variables. Set JWT_SECRET, ADMIN_USERNAME, and ADMIN_PASSWORD."
  );
}

fs.mkdirSync(dataDir, { recursive: true });

function loadStore() {
  if (!fs.existsSync(dataFilePath)) {
    return {
      nextAdminId: 1,
      nextAppointmentId: 1,
      admins: [],
      appointments: []
    };
  }

  return JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
}

function saveStore(store) {
  fs.writeFileSync(dataFilePath, JSON.stringify(store, null, 2));
}

function getAdminByUsername(store, username) {
  return store.admins.find((admin) => admin.username === username) || null;
}

function insertAdmin(store, username, passwordHash) {
  const admin = {
    id: store.nextAdminId++,
    username,
    passwordHash,
    createdAt: new Date().toISOString()
  };

  store.admins.push(admin);
  saveStore(store);
  return admin;
}

function insertAppointment(store, payload) {
  const appointment = {
    id: store.nextAppointmentId++,
    ...payload,
    createdAt: new Date().toISOString()
  };

  store.appointments.push(appointment);
  saveStore(store);
  return appointment;
}

function listAppointments(store) {
  return [...store.appointments].sort((a, b) => {
    if (a.createdAt === b.createdAt) {
      return b.id - a.id;
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function ensureAdminUser() {
  const store = loadStore();
  const existingAdmin = getAdminByUsername(store, adminUsername);

  if (existingAdmin) {
    return;
  }

  const passwordHash = bcrypt.hashSync(adminPassword, 12);
  insertAdmin(store, adminUsername, passwordHash);
  console.log(`Seeded admin user: ${adminUsername}`);
}

function createAuthToken(admin) {
  return jwt.sign(
    {
      sub: String(admin.id),
      username: admin.username
    },
    jwtSecret,
    { expiresIn: tokenLifetime }
  );
}

function setAuthCookie(res, token) {
  res.cookie("admin_token", token, {
    httpOnly: true,
    sameSite: cookieSameSite,
    secure: cookieSecure,
    maxAge: 12 * 60 * 60 * 1000
  });
}

function clearAuthCookie(res) {
  res.clearCookie("admin_token", {
    httpOnly: true,
    sameSite: cookieSameSite,
    secure: cookieSecure
  });
}

function requireAdminAuth(req, res, next) {
  const token = req.cookies.admin_token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    req.admin = jwt.verify(token, jwtSecret);
    next();
  } catch (error) {
    clearAuthCookie(res);
    return res.status(401).json({ error: "Session expired" });
  }
}

function normalizeAppointmentPayload(body) {
  return {
    name: String(body.name || "").trim(),
    phone: String(body.phone || "").trim(),
    location: String(body.location || "").trim(),
    issue: String(body.issue || "").trim(),
    service: body.service ? String(body.service).trim() : null,
    serviceMode: body.serviceMode ? String(body.serviceMode).trim() : null,
    serviceType: body.serviceType ? String(body.serviceType).trim() : null
  };
}

function validateAppointment(payload) {
  return payload.name && payload.phone && payload.location && payload.issue;
}

ensureAdminUser();

app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    res.header("Access-Control-Allow-Origin", requestOrigin);
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});

app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname));

app.post(["/api/login", "/api/admin/login"], (req, res) => {
  const username = String(req.body.username || req.body.email || "").trim();
  const password = String(req.body.password || "");
  const store = loadStore();
  const admin = getAdminByUsername(store, username);

  if (!admin || !bcrypt.compareSync(password, admin.passwordHash)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = createAuthToken(admin);
  setAuthCookie(res, token);

  return res.json({
    success: true,
    user: {
      username: admin.username
    }
  });
});

app.post("/api/admin/logout", (req, res) => {
  clearAuthCookie(res);
  return res.json({ success: true });
});

app.get("/api/admin/session", requireAdminAuth, (req, res) => {
  return res.json({
    authenticated: true,
    user: {
      username: req.admin.username
    }
  });
});

app.post("/api/appointments", (req, res) => {
  const payload = normalizeAppointmentPayload(req.body);
  const store = loadStore();

  if (!validateAppointment(payload)) {
    return res.status(400).json({ error: "Missing required appointment fields" });
  }

  const appointment = insertAppointment(store, payload);

  return res.status(201).json({
    success: true,
    appointmentId: appointment.id
  });
});

app.get(["/api/appointments", "/api/admin/appointments"], requireAdminAuth, (req, res) => {
  const store = loadStore();
  const appointments = listAppointments(store).map((appointment) => ({
    ...appointment,
    date: appointment.createdAt.split("T")[0]
  }));

  return res.json({ appointments });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
