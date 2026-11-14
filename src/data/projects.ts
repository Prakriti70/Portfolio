import type { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "sample-1",
    title: "Heliotropic Sunflower",
    repoUrl: "https://github.com/Prakriti70/Heliotropic-Sunflower.git",
    category: "Embedded",
    thumbnail: "/images/projects/sunflower.png",
    thumbnailAlt: "Placeholder illustration for a project thumbnail",
    aspect: "wide",
    description:
    "A 3D sunflower simulation built with C++ and OpenGL that models heliotropism through animation, transformations, and real-time rendering.",
  inspiration:
    "Curiosity about how sunflowers respond to sunlight and how computer graphics can bring natural phenomena to life.",
  technologies: ["C++", "OpenGL", "GLFW", "GLAD", "GLM", "CMake"],
  role: "Graphics programming, animation, and implementation of mathematical transformations and shading.",
  },
  {
    id: "sample-2",
    title: "ForestGuardAI",
    repoUrl: "https://github.com/Prakriti70/forest.git",
    category: "Web",
    thumbnail: "/images/ForestGuardAI.jpeg",
    thumbnailAlt: "Placeholder illustration for a project thumbnail",
    aspect: "square",
    description:
    "An AI-powered wildlife monitoring platform designed to support species detection, activity analysis, and forest surveillance.",
  inspiration:
    "Exploring how AI-driven solutions can contribute to wildlife conservation and smarter environmental monitoring.",
  technologies: ["React", "TypeScript", "Vite", "Tailwind CSS"],
  role: "Frontend development and monitoring dashboard implementation as part of a hackathon team.",
  
  },
  {
    id: "sample-3",
    title: "Campus Navigation System",
    repoUrl: "https://github.com/Prakriti70/Campus-Navigation-System-DSA-.git",
    category: "Games",
    thumbnail: "/images/projects/campus.png",
    thumbnailAlt: "Placeholder illustration for a project thumbnail",
    aspect: "square",
    description:
    "A Python desktop application that visualizes graph traversal and shortest-path algorithms on an interactive Pulchowk Campus map.",
  inspiration:
    "Exploring how data structures and graph algorithms can be applied to real-world navigation problems.",
  technologies: ["Python", "Tkinter", "Matplotlib", "Pillow"],
  role: "Graph algorithms, data structure implementations, and desktop UI development.",
  
  },
];
