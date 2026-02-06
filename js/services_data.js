const servicesData = {
    "service1": {
        "title": "Physiotherapy",
        "image": "images/physiotherapy.png",
        "description": "Our Physiotherapy department focuses on restoring movement and function to the body. Through a combination of manual therapy, therapeutic exercises, and advanced modalities, we help patients recover from injury, manage pain, and improve their overall physical quality of life. Whether you are recovering from surgery, a sports injury, or a neurological condition, our expert physiotherapists tailor a program specific to your needs.",
        "detailsHTML": `
            <h4>Key Focus Areas</h4>
            <ul>
                <li>Musculoskeletal Rehabilitation</li>
                <li>Neurological Rehabilitation</li>
                <li>Cardiorespiratory Physiotherapy</li>
                <li>Geriatric Mobility Training</li>
            </ul>
            <h4>Our Approach</h4>
            <p>We believe in a patient-centered approach where education and empowerment are key. Our sessions are one-on-one, ensuring you receive the dedicated attention required for faster recovery. We utilize evidence-based techniques to treat the root cause of the problem, not just the symptoms.</p>
        `
    },
    "service2": {
        "title": "Occupational Therapy",
        "image": "images/occupational_therapy.png",
        "description": "Occupational Therapy (OT) at The Rehab House helps people across the lifespan to do the things they want and need to do through the therapeutic use of daily activities (occupations). Our goal is to enable people of all ages to live life to its fullest by helping them promote health, and prevent—or live better with—injury, illness, or disability.",
        "detailsHTML": `
            <h4>Therapy Goals</h4>
            <ul>
                <li>Activities of Daily Living (ADL) Training</li>
                <li>Fine Motor Skill Development</li>
                <li>Sensory Integration Therapy</li>
                <li>Adaptive Equipment Prescription</li>
            </ul>
            <h4>Restoring Independence</h4>
            <p>Our occupational therapists work with you to break down barriers that affect your emotional, social, and physical needs. From relearning how to dress and eat to returning to work or school, we provide the tools and strategies necessary for independence.</p>
        `
    },
    "service3": {
        "title": "Speech Therapy",
        "image": "images/speech_therapy.png",
        "description": "Our Speech-Language Pathologists assess and treat speech, language, social communication, cognitive-communication, and swallowing disorders in children and adults. Communication is vital for connecting with others, and our team is dedicated to helping you or your loved one communicate effectively and confidently.",
        "detailsHTML": `
            <h4>Conditions Treated</h4>
            <ul>
                <li>Aphasia & Dysarthria (Post-Stroke)</li>
                <li>Swallowing Disorders (Dysphagia)</li>
                <li>Voice Disorders</li>
                <li>Pediatric Speech Delay</li>
            </ul>
            <h4>Communication Recovery</h4>
            <p>We use a variety of techniques including articulation therapy, language intervention activities, and oral-motor therapy. For swallowing difficulties, we provide safe swallowing strategies and diet modifications to prevent aspiration and ensure proper nutrition.</p>
        `
    },
    "service4": {
        "title": "Cognitive Therapy",
        "image": "images/cognitive_therapy.png",
        "description": "Cognitive Therapy focuses on improving cognitive functions such as attention, memory, executive function, and problem-solving, which may be affected by brain injury, stroke, or neurodegenerative diseases. Our program is designed to stimulate neuroplasticity and help patients regain their mental sharpness.",
        "detailsHTML": `
            <h4>Cognitive Domains</h4>
            <ul>
                <li>Memory Rehabilitation</li>
                <li>Attention & Concentration Training</li>
                <li>Executive Function Enhancement</li>
                <li>Visual-Spatial Processing</li>
            </ul>
            <h4>Brain Training</h4>
            <p>Each session is customized to challenge the brain at the right level. We use computer-based training, puzzles, and real-world simulation tasks to rebuild neural pathways. This therapy is crucial for returning to complex daily tasks like managing finances, cooking, or working.</p>
        `
    },
    "service5": {
        "title": "Psychologist",
        "image": "images/psychologist.png",
        "description": "Mental health is as important as physical health in the rehabilitation journey. Our clinical psychologists provide support for patients dealing with the emotional impact of injury, disability, or chronic illness. We offer a safe space to discuss fears, anxiety, depression, and adjustment issues.",
        "detailsHTML": `
            <h4>Therapeutic Support</h4>
            <ul>
                <li>Coping with Chronic Illness</li>
                <li>Trauma & PTSD Support</li>
                <li>Depression & Anxiety Management</li>
                <li>Family Counseling</li>
            </ul>
            <h4>Holistic Wellness</h4>
            <p>We believe in treating the whole person. Our psychological support helps patients stay motivated during their physical rehabilitation. We teach stress management techniques, mindfulness, and cognitive-behavioral strategies to build resilience and emotional well-being.</p>
        `
    },
    "service6": {
        "title": "Pain Management",
        "image": "images/pain_management.png",
        "description": "Chronic pain can be debilitating. Our Pain Management program uses a multidisciplinary approach to alleviate pain and restore function. We combine physical therapies with advanced modalities to manage pain without total reliance on medication.",
        "detailsHTML": `
            <h4>Pain Relief Modalities</h4>
            <ul>
                <li>Electrotherapy (TENS, IFT)</li>
                <li>Dry Needling & Cupping</li>
                <li>Manual Therapy & Mobilization</li>
                <li>Myofascial Release</li>
            </ul>
            <h4>Techniques</h4>
            <p>Understanding pain is the first step to managing it. We educate patients on pain science and provide active strategies to manage flare-ups. Our goal is to break the pain cycle and get you back to moving freely and comfortably.</p>
        `
    },
    "service7": {
        "title": "Dietitian",
        "image": "images/dietitian.png",
        "description": "Nutrition plays a critical role in recovery and overall health. Our registered dietitians provide personalized nutrition plans to support rehabilitation goals, manage chronic diseases, and promote healthy living. Whether you need to gain weight, lose weight, or manage a specific condition, we are here to guide you.",
        "detailsHTML": `
            <h4>Nutritional Services</h4>
            <ul>
                <li>Medical Nutrition Therapy (Diabetes, specialized diets)</li>
                <li>Weight Management Programs</li>
                <li>Post-Surgical Nutrition</li>
                <li>Pediatric Nutrition</li>
            </ul>
            <h4>Food as Medicine</h4>
            <p>We analyze your dietary habits and create realistic, sustainable meal plans. We focus on nutrient-dense foods that fuel recovery, boost immunity, and improve energy levels. Education on reading food labels and healthy cooking is also a core part of our program.</p>
        `
    },
    "service8": {
        "title": "Robotic Rehabilitation Therapy",
        "image": "images/robotic_rehab.png",
        "description": "We are proud to offer state-of-the-art Robotic Rehabilitation Therapy. This cutting-edge technology allows for high-repetition, precise movements that stimulate neuroplasticity in ways manual therapy alone cannot. It is particularly effective for stroke (CVA) and spinal cord injury recovery.",
        "detailsHTML": `
            <h4>Technology Benefits</h4>
            <ul>
                <li>Intensive Repetitive Training</li>
                <li>Real-time Biofeedback</li>
                <li>Interactive Game-based Therapy</li>
                <li>Objective Progress Tracking</li>
            </ul>
            <h4>Advanced Recovery</h4>
            <p>Our robotic devices assist patients in moving their limbs, allowing them to perform movements they might not be able to do on their own. This intensive input helps 'rewire' the brain, accelerating the recovery of motor function and independence.</p>
        `
    },
    "service9": {
        "title": "Yoga",
        "image": "images/yoga_therapy.png",
        "description": "Medical Yoga Therapy integrates traditional yoga practices with modern medical knowledge. It is a gentle yet effective way to improve flexibility, balance, strength, and mental focus. Our sessions are adapted to accommodate physical limitations and specific medical conditions.",
        "detailsHTML": `
            <h4>Yoga Benefits</h4>
            <ul>
                <li>Improved Flexibility & Range of Motion</li>
                <li>Stress Reduction & Relaxation</li>
                <li>Core Strength & Stability</li>
                <li>Breath Control (Pranayama)</li>
            </ul>
            <h4>Mind-Body Connection</h4>
            <p>Yoga therapy is tailored to your specific needs. We focus on gentle asanas (poses) that support your rehabilitation goals. It is excellent for managing chronic pain, reducing stress, and improving overall body awareness and posture.</p>
        `
    },
    "service10": {
        "title": "Fitness Training",
        "image": "images/fitness_training.png",
        "description": "Our Medical Fitness Training program bridges the gap between rehabilitation and general fitness. Once pain is managed and basic function is restored, it is essential to build strength and endurance to prevent re-injury. Our fitness experts design safe, effective workout routines supervised by medical professionals.",
        "detailsHTML": `
            <h4>Program Components</h4>
            <ul>
                <li>Strength & Conditioning</li>
                <li>Cardiovascular Endurance Training</li>
                <li>Functional Movement Training</li>
                <li>Weight Loss & Metabolic Health</li>
            </ul>
            <h4>Safe Exercise</h4>
            <p>Unlike a regular gym, our environment is medically supervised. We ensure correct form and appropriate intensity to avoid injury. Whether you are an athlete returning to sport or bringing structured movement back into your life, our training will help you reach your peak potential.</p>
        `
    },
    "service11": {
        "title": "Orthotic Therapy",
        "image": "images/orthotic_therapy.png",
        "description": "Orthotic Therapy involves the design, fabrication, and fitting of custom braces and supports (orthoses). These devices are used to support weakened limbs, correct deformities, and improve function. Our orthotists work closely with the physiotherapy team to ensure the best fit and function.",
        "detailsHTML": `
            <h4>Orthotic Solutions</h4>
            <ul>
                <li>Custom Foot Orthotics (Insoles)</li>
                <li>Ankle-Foot Orthoses (AFOs)</li>
                <li>Spinal Braces & Supports</li>
                <li>Pediatric Orthotics</li>
            </ul>
            <h4>Support & Alignment</h4>
            <p>Proper alignment is the foundation of movement. Our custom orthotics help distribute pressure evenly, correct gait abnormalities, and prevent future injuries. We evaluate your biomechanics to create a device that fits your lifestyle and needs perfectly.</p>
        `
    }
};
