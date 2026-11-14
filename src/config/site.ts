import type { SiteConfig } from "@/types/site";


 
 
export const siteConfig: SiteConfig = {
  name: "Prakriti Poudel", 
  monogram: "PP", 
  siteTitle: "Prakriti Poudel · Engineering student", 
  description:
    "Portfolio of a Computer Engineering student who builds things with code and makes things with paint, words and paper.",

  tagline: "A little bit of logic, a little bit of art, and a lot of curiosity.",
  intro:
    "I'm a second-year Computer Engineering student. I like figuring out how things work, and then making something of my own: sometimes in code, sometimes in paint.",

  rotatingPhrases: [
    "debugging things",
    "mixing greens",
    "reading documentation",
    "filling sketchbooks",
    "asking why",
  ],

  
  currentlyExploring: "Exploring research at the intersection of people and technology.",

     portrait: {
     src: "/images/artwork/me.png",
     alt: "Photo of Prakriti",   
   },

  about: {
    heading: "About me!",
    paragraphs: [
      "Hi! I'm in my second year of Computer Engineering, and I'm still at the stage where every new concept feels like a door I get to open. I like building small things to understand big ones.",
      "Away from the screen I paint, scribble poems and make things from whatever is lying around. Oddly, the two sides keep borrowing from each other: debugging feels like composition, and painting feels like problem-solving. All in all , I like seeing things transform from one state to another, be it a a line of code turning into something beautiful or a blank canvas turning into a painting.",
    ],
    
    facts: [
      { label: "Studying", value: "Computer Engineering (year 2)" },
      { label: "Making", value: "Mostly Programs, watercolours, short poems" },
      { label: "Learning", value: "AI, machine learning, computer graphics and the possibilities they bring" },
      { label: "Away from screens", value: "Exploring different interests beyond tech. A little bit of  gardening, cooking, painting, and crafting" },
    ],
  },

  
  curiosityNotes: [
    "I saw pixels in my canvas.",
    "I trust a sketch more than a spec. Draw it first.",
    "I smile randomly thinking about how sunflower seeds have their own algorithm.",
    
  ],

  easterEgg: {
    title: "You found the moon.",
    lines: ["if (curious) {", "  keep_looking();", "} else {", "  paint_something();", "}"],
  },

  email: "prakritip900@gmail.com",

 
  socials: [
    { label: "GitHub", href: "https://github.com/Prakriti70" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/prakriti-poudel-4ba157337/" },
    { label: "Instagram", href: "https://www.instagram.com/pratssss7/?hl=en" },
  ],

  contactClosing: "Say hi, share a project idea, tell me what you've been creating lately or leave a suggestion.And if any of my creations catch your eye, feel free to reach out;  whether you're curious about the process or interested in making one yours.",

  footerLine: "Made by hand, with a little code and a lot of background music.",
};
