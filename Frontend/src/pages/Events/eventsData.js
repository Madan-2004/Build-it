const eventsData = [
    {
      title: "Hackathon 2024 - IIT Indore",
      date: "10th March 2024",
      poster: "/data/media/images/general/dummy.jpg",
      description: "IIT Indore presents its flagship hackathon, where innovators and problem solvers collaborate to build real-world solutions.",
      venue: "Innovation Lab, IIT Indore",
      category: "Technical",
      registerLink: "#",
      agenda: [
        { time: "9:00 AM", topic: "Opening Ceremony" },
        { time: "10:00 AM", topic: "Problem Statement Reveal & Team Formation" },
        { time: "12:00 PM", topic: "Coding Begins" },
        { time: "8:00 PM", topic: "First Round of Evaluations" },
        { time: "10:00 AM (Next Day)", topic: "Final Presentations & Winner Announcement" }
      ],
      speakers: [
        { name: "Dr. Rahul Sharma", bio: "AI & ML Expert, IIT Indore" },
        { name: "Ms. Priya Mehta", bio: "Software Engineer at Google" }
      ],
      fees: "₹500 per team",
      schedule: "24-Hour Event",
      contact: "hackathon@iitindore.ac.in"
    },
    {
      title: "Cultural Night - Tarang 2024",
      date: "25th March 2024",
      poster: "/data/media/images/general/dummy.jpg",
      description: "An electrifying cultural festival featuring music, dance, drama, and IIT Indore's best talents.",
      venue: "Open Air Theatre, IIT Indore",
      category: "Cultural",
      registerLink: "#",
      agenda: [
        { time: "6:00 PM", topic: "Inaugural Dance Performance" },
        { time: "7:00 PM", topic: "Music Band Performances" },
        { time: "8:00 PM", topic: "Drama & Stand-up Comedy Acts" },
        { time: "9:30 PM", topic: "DJ Night & Closing Ceremony" }
      ],
      speakers: [],
      fees: "Free Entry for IIT Indore Students, ₹200 for others",
      schedule: "6:00 PM - 11:00 PM",
      contact: "tarang@iitindore.ac.in"
    },
    {
      title: "IIT Sports Fest - Aaveg 2024",
      date: "5th April 2024 - 7th April 2024",
      poster: "/data/media/images/general/dummy.jpg",
      description: "Inter-college sports fest featuring cricket, football, basketball, athletics, and more.",
      venue: "Sports Complex, IIT Indore",
      category: "Sports",
      registerLink: "#",
      agenda: [
        { time: "9:00 AM", topic: "Opening Ceremony & Torch Run" },
        { time: "10:00 AM", topic: "Cricket & Basketball Matches Begin" },
        { time: "2:00 PM", topic: "Athletics & Marathon" },
        { time: "6:00 PM", topic: "Day 1 Closing Ceremony" },
        { time: "Final Day", topic: "Prize Distribution & Closing Ceremony" }
      ],
      speakers: [],
      fees: "₹100 per participant (includes sports kit)",
      schedule: "9:00 AM - 7:00 PM",
      contact: "aaveg@iitindore.ac.in"
    },
    {
      title: "Machine Learning Workshop",
      date: "12th April 2024",
      poster: "https://via.placeholder.com/600x300",
      description: "Hands-on workshop on Machine Learning techniques using Python & TensorFlow.",
      venue: "Data Science Lab, IIT Indore",
      category: "Workshops",
      registerLink: "#",
      agenda: [
        { time: "10:00 AM", topic: "Introduction to Machine Learning" },
        { time: "11:00 AM", topic: "Supervised vs. Unsupervised Learning" },
        { time: "12:30 PM", topic: "Hands-on with TensorFlow & PyTorch" },
        { time: "2:00 PM", topic: "Building an ML Model from Scratch" },
        { time: "4:00 PM", topic: "Q&A and Certificate Distribution" }
      ],
      speakers: [
        { name: "Dr. Ankit Verma", bio: "Professor, Data Science, IIT Indore" },
        { name: "Ms. Neha Kapoor", bio: "Machine Learning Engineer at Microsoft" }
      ],
      fees: "₹300 for students, ₹700 for professionals",
      schedule: "10:00 AM - 5:00 PM",
      contact: "mlworkshop@iitindore.ac.in"
    },
    {
      title: "Entrepreneurship Summit - E-Summit 2024",
      date: "20th April 2024 - 21st April 2024",
      poster: "https://via.placeholder.com/600x300",
      description: "IIT Indore's grand summit featuring startup pitches, panel discussions, and mentorship sessions.",
      venue: "Auditorium, IIT Indore",
      category: "Technical",
      registerLink: "#",
      agenda: [
        { time: "10:00 AM", topic: "Keynote Address by CEO of XYZ Startup" },
        { time: "11:30 AM", topic: "Startup Pitching Sessions" },
        { time: "2:00 PM", topic: "Panel Discussion: Future of Indian Startups" },
        { time: "4:00 PM", topic: "Networking Session with Investors" },
        { time: "6:00 PM", topic: "Closing Ceremony & Awards" }
      ],
      speakers: [
        { name: "Mr. Rohan Mehta", bio: "CEO, XYZ Startup" },
        { name: "Ms. Ananya Singh", bio: "Investor, Sequoia Capital" }
      ],
      fees: "₹500 for students, ₹1000 for professionals",
      schedule: "10:00 AM - 6:00 PM",
      contact: "esummit@iitindore.ac.in"
    },
    {
      title: "AI & Robotics Exhibition",
      date: "30th April 2024",
      poster: "https://via.placeholder.com/600x300",
      description: "Live showcase of AI-powered robots and self-driving vehicles developed by IIT Indore students.",
      venue: "Innovation Center, IIT Indore",
      category: "Technical",
      registerLink: "#",
      agenda: [
        { time: "11:00 AM", topic: "Self-Driving Car Demonstration" },
        { time: "12:30 PM", topic: "AI-Powered Chatbots Showcase" },
        { time: "2:00 PM", topic: "Meet the Innovators & Q&A" }
      ],
      speakers: [
        { name: "Dr. Sandeep Joshi", bio: "Professor, Robotics, IIT Indore" }
      ],
      fees: "Free Entry",
      schedule: "11:00 AM - 4:00 PM",
      contact: "airobotics@iitindore.ac.in"
    }
  ];
  
  export default eventsData;
  