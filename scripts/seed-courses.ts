// Seeds three ready-made courses and assigns them to programs.
// Run AFTER applying migration 016:  npx tsx scripts/seed-courses.ts
//
//   - "Wire Your Home: Networking for Dads"      -> networking-live
//   - "Level Up Your Setup: Networking for Gamers" -> networking-live
//   - "Future Tech Lab: Your Hands-On Tour of Tomorrow" -> future-tech-lab
//
// Idempotent: a course is skipped if its slug already exists.

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

interface Lesson {
  title: string;
  story_body: string;
  workbook: string;
}
interface Question {
  prompt: string;
  options: string[];
  correct_index: number;
  explanation: string;
}
interface SeedCourse {
  slug: string;
  title: string;
  summary: string;
  audience: string;
  level: "intro" | "beginner" | "intermediate" | "advanced";
  estimated_minutes: number;
  program: string; // website program slug
  lessons: Lesson[];
  questions: Question[];
}

const COURSES: SeedCourse[] = [
  {
    slug: "home-networking-dads",
    title: "Wire Your Home: Networking for Dads",
    summary:
      "Set up a home network the whole family can count on, and understand exactly how it works while you do it.",
    audience: "Fathers",
    level: "intro",
    estimated_minutes: 35,
    program: "networking-live",
    lessons: [
      {
        title: "The House That Needs a Network",
        story_body:
          "Marcus just moved into a new place. Boxes everywhere, and everybody already asking the same thing: *is the Wi-Fi up yet?* His work laptop needs a solid connection for video calls in the back room. The TV needs to stream. The kids need the internet for homework (and, let's be honest, games). Before any of that works, Marcus needs one thing: a **network**.\n\nA network is just a group of devices that can talk to each other and reach the internet. The device that makes that happen is the **router**. Think of the router as the front door and the traffic cop of your home internet, all in one. Everything in the house connects to the router, and the router connects out to the internet.\n\nThat internet comes from your **ISP** (internet service provider, like Spectrum or AT&T). The box on the wall from them is the **modem**, it brings the internet into the house. Sometimes the modem and router are one combined box, sometimes they're two. Either way, the job is the same: the modem brings the internet in, the router shares it out to all your devices.",
        workbook:
          "**Remember this:**\n- A **network** = your devices talking to each other and the internet.\n- The **router** shares the internet to everything in your home. It's the front door and the traffic cop.\n- The **modem** brings the internet in from your ISP. Sometimes it's built into the router.\n\n**Try it:** Find your router. Look for a box with a few blinking lights and antennas (or one flat box). That's the heart of your home network.",
      },
      {
        title: "Wires and Waves",
        story_body:
          "Marcus has a choice for every device: connect it with a **cable** or over **Wi-Fi**. Both get you online. They just do it differently.\n\nA network cable (an **ethernet** cable, the kind with the wide clip) is a physical wire from the device straight to the router. It's steady and fast, and it doesn't care about walls or distance the way Wi-Fi does. This is the **physical layer**, the actual wires that carry your data. For his work video calls in the back room, Marcus runs an ethernet cable. No dropouts in the middle of a meeting.\n\n**Wi-Fi** sends the same data through the air using radio waves, so no cable needed. Perfect for phones, tablets, and anything that moves around. The trade-off: walls, distance, and interference can slow it down.\n\nSimple rule of thumb: if it sits in one place and needs to be rock-solid (a work computer, a TV, a game console), run a cable if you can. If it moves around, use Wi-Fi.",
        workbook:
          "**Remember this:**\n- **Ethernet cable** = a wire to the router. Steady, fast, great for things that stay put.\n- **Wi-Fi** = the same data through the air. Great for phones and tablets that move.\n- Walls and distance weaken Wi-Fi, not cables.\n\n**Try it:** Look at the back of your router. Those wide slots are ethernet ports. That's where a wired device plugs in.",
      },
      {
        title: "How Devices Find Each Other",
        story_body:
          "Once everything's connected, how does the router know which device is which? Every device gets an **IP address**, a number that works like a home address. When data needs to get to Marcus's laptop and not the TV, the IP address is how the router delivers it to the right place.\n\nHere's the good news: you almost never assign these by hand. The router hands out IP addresses automatically as devices join. That automatic system is called **DHCP**, but you don't need the name, just know the router takes care of it.\n\nAll the devices in Marcus's house share the same local **network** (you'll hear the word **subnet**, think of it as your street, everyone on it is a neighbor). Devices on the same street can talk to each other easily, and the router is the way out to the rest of the world.",
        workbook:
          "**Remember this:**\n- Every device gets an **IP address**, like a home address, so data reaches the right device.\n- The router hands out those addresses automatically.\n- Your home devices share one local network (a **subnet**), like houses on the same street.\n\n**Try it:** On a phone connected to Wi-Fi, open settings and find the Wi-Fi details. You'll see an IP address like 192.168.x.x, that's your phone's address on your street.",
      },
      {
        title: "Wi-Fi That Actually Works",
        story_body:
          "The back bedroom has a dead spot. Classic. Good Wi-Fi is mostly about a few simple things.\n\n**Placement:** put the router high and central, not on the floor behind the TV. Wi-Fi radiates out like light from a lamp, walls and metal block it.\n\n**The name and password:** your network name is the **SSID** (what you tap to connect). Give it a strong password. This keeps the neighbors, and anyone parked outside, off your internet.\n\n**Guest Wi-Fi:** most routers let you turn on a separate **guest network**. When Marcus's family comes over, they hop on the guest Wi-Fi. They get internet, but they're kept off the main network where his work laptop and personal devices live. It's the digital version of letting people into the living room but not your bedroom.",
        workbook:
          "**Remember this:**\n- Put the router **high and central** for the best coverage.\n- Your network name is the **SSID**; always set a strong password.\n- Turn on a **guest network** for visitors, it keeps them off your main devices.\n\n**Try it:** Log into your router (the web address is usually on a sticker on the box) and look for the 'Guest Network' setting. Turning it on takes two minutes.",
      },
      {
        title: "When It Goes Down",
        story_body:
          "It will happen: the internet drops right before a big call. Before you panic or pay someone, run the ritual.\n\n**Restart the boxes.** Unplug the modem and router, wait 30 seconds, plug the modem back in first, then the router. This fixes the majority of problems. Give it a couple minutes to fully wake up.\n\n**Check the lights.** Every modem/router has status lights. A steady internet light usually means good; a red or blinking one points to the problem. Your ISP's app will often tell you if the outage is on their end, not yours.\n\n**Isolate it.** Is it just one device or everything? If it's only the laptop, the problem's the laptop or its Wi-Fi. If it's everything, it's the router or the ISP. That one question saves you an hour.\n\nYou now know more about your home network than most people in your building. That's a real skill, and it's the same thinking that runs the biggest data centers on earth.",
        workbook:
          "**Remember this:**\n- **Restart** the modem and router first, it fixes most issues.\n- **Check the status lights** and your ISP's app for outages.\n- Ask: **one device or all of them?** That tells you where the problem is.\n\n**Try it:** Next time the internet acts up, run the restart ritual before anything else.",
      },
    ],
    questions: [
      {
        prompt: "What does a router do in your home?",
        options: [
          "Shares the internet out to all your devices and directs the traffic",
          "Stores all your family photos",
          "Makes your Wi-Fi password stronger automatically",
          "Charges your devices",
        ],
        correct_index: 0,
        explanation: "The router is the front door and traffic cop, connecting your devices to the internet and to each other.",
      },
      {
        prompt: "For a work video call that can't drop, what's the best connection?",
        options: ["Guest Wi-Fi", "A wired ethernet cable", "Someone's phone hotspot", "Turning Wi-Fi off and on"],
        correct_index: 1,
        explanation: "A wired ethernet connection is the steadiest, ideal for something in one spot that must stay reliable.",
      },
      {
        prompt: "An IP address is most like…",
        options: ["A password", "A home address for each device", "A brand of router", "A type of cable"],
        correct_index: 1,
        explanation: "Each device gets an IP address so the router can deliver data to the right place, just like mail to a home address.",
      },
      {
        prompt: "Why set up a guest Wi-Fi network?",
        options: [
          "It's faster than the main network",
          "It keeps visitors off your main devices and network",
          "It's required by your ISP",
          "It hides your Wi-Fi from your family",
        ],
        correct_index: 1,
        explanation: "Guests get internet while staying off the network where your personal and work devices live.",
      },
      {
        prompt: "The internet just dropped for the whole house. What's the first thing to try?",
        options: [
          "Buy a new router",
          "Restart the modem and router",
          "Call every neighbor",
          "Reset every device to factory settings",
        ],
        correct_index: 1,
        explanation: "Restarting the modem and router fixes the majority of home internet problems.",
      },
    ],
  },

  {
    slug: "home-networking-kids",
    title: "Level Up Your Setup: Networking for Gamers",
    summary:
      "Set up a home so a PS5 works in one room, an Xbox in another, and there's fast Wi-Fi for the whole house and guests, and learn how networks really work while you build it.",
    audience: "Kids & youth, 14 to 18",
    level: "intro",
    estimated_minutes: 30,
    program: "networking-live",
    lessons: [
      {
        title: "Your Mission: Everything Online at Once",
        story_body:
          "Here's the mission. There's a **PS5 in one room**, an **Xbox in another**, phones and a laptop all over the house, and this weekend friends are coming over and they'll want Wi-Fi too. Your job: make all of it work, fast, at the same time.\n\nTo pull that off, you're building a **network**, a group of devices that can talk to each other and reach the internet. The device that runs the whole thing is the **router**. Think of it like the base station in a game: everything connects back to it, and it's your link out to the wider world (the internet).\n\nEvery console, phone, and laptop is a player joining your base. By the end of this course you'll know exactly how they all get online without lagging each other out.",
        workbook:
          "**Remember this:**\n- A **network** = your devices connected to each other and the internet.\n- The **router** is the base station everything connects to.\n- Your goal: PS5, Xbox, phones, and guests, all online and fast.",
      },
      {
        title: "Cable or Air?",
        story_body:
          "Every device connects one of two ways: through a **cable** or over **Wi-Fi**. For gaming, this choice actually matters.\n\nAn **ethernet cable** is a physical wire from your console straight to the router. This is the **physical layer**, the real wire your data travels through. It's the most stable connection you can get, and it has the lowest **lag** (the delay between you pressing a button and it happening online). If you can run a cable to your PS5 and Xbox, do it. Serious players almost always play wired.\n\n**Wi-Fi** sends the same data through the air. It's perfect for phones and tablets that move around, but walls and distance can add lag, which is the last thing you want mid-match.\n\nRule for gamers: **wire the consoles, Wi-Fi the phones.**",
        workbook:
          "**Remember this:**\n- **Ethernet cable** = lowest lag, most stable. Best for consoles.\n- **Wi-Fi** = convenient and wireless, best for phones.\n- **Lag** is delay, and wired connections have the least of it.\n\n**Try it:** Check the back of your console for an ethernet port (a wide slot). A cable from there to the router is the single biggest upgrade to your connection.",
      },
      {
        title: "Every Console Needs an Address",
        story_body:
          "When you're in a match, data has to reach *your* PS5, not the Xbox in the other room. How does the router keep them straight? Every device gets its own **IP address**, a number that works like an address so data goes to the right place.\n\nYou don't type these in yourself, the router hands them out automatically the moment a device connects. Your PS5 gets one address, the Xbox gets another, each phone gets its own.\n\nAll your devices together form one local **network**, and you'll hear it called a **subnet**, think of it as your **squad**. Everyone in the squad (the PS5, the Xbox, the phones) is on the same local network and can reach each other, and the router is how the whole squad gets out to the internet.",
        workbook:
          "**Remember this:**\n- Every device gets its own **IP address** so data reaches the right one.\n- The router assigns addresses automatically.\n- Your home devices form one local network, a **subnet**, like a squad on the same team.\n\n**Try it:** In your console's network settings, find 'View Connection Status' or 'IP Address'. You'll see your console's address, like 192.168.x.x.",
      },
      {
        title: "Wi-Fi Without the Lag",
        story_body:
          "The phones and your friends still need great Wi-Fi. A few things make or break it.\n\nWi-Fi comes in two lanes: **2.4 GHz** reaches farther but is slower and more crowded; **5 GHz** is faster but doesn't travel as far. Most routers broadcast both and pick for you, just know that close to the router, 5 GHz is the fast lane.\n\n**Placement matters:** the router should be high and central, not buried in a cabinet. Wi-Fi spreads out like light, walls block it.\n\nWhen friends come over, put them on a **guest network**, a separate Wi-Fi just for visitors. They get online, but they're not on your main network slowing down your squad or getting into your stuff. It's the smart move whether you've got two guests or ten.",
        workbook:
          "**Remember this:**\n- **5 GHz** Wi-Fi is faster up close; **2.4 GHz** reaches farther.\n- Put the router **high and central** for the best signal.\n- Use a **guest network** for friends, it keeps your main setup fast and private.",
      },
      {
        title: "Boss Level: Make It Fast",
        story_body:
          "You've got the setup. Now make it *fast*.\n\n**Wire what matters.** The PS5 and Xbox on ethernet cables beat Wi-Fi almost every time for gaming.\n\n**Get close, or get a cable.** If a console must be on Wi-Fi, put it as close to the router as possible with the fewest walls between.\n\n**Know the fix.** If a console won't connect: check the cable or Wi-Fi password, restart the console, and if the whole house is down, restart the router (unplug 30 seconds, plug back in). Ask yourself: is it just this console, or everything? That tells you where the problem is.\n\nThat's it, you just designed a home network that keeps a PS5, an Xbox, a house full of phones, and a crew of guests all online at once. That's real networking, the same skill that runs stadiums, offices, and data centers.",
        workbook:
          "**Remember this:**\n- **Wire the consoles** for the lowest lag.\n- On Wi-Fi, get **close to the router** with fewer walls.\n- Fix it: check the connection, restart the console, restart the router if the whole house is down.\n- Ask: **one device or all of them?**",
      },
    ],
    questions: [
      {
        prompt: "You want the lowest lag on your PS5. What's the best move?",
        options: ["Connect it with an ethernet cable", "Move it farther from the router", "Use the guest network", "Turn off the Xbox"],
        correct_index: 0,
        explanation: "A wired ethernet connection gives the most stable, lowest-lag connection, which is why serious gamers play wired.",
      },
      {
        prompt: "Your home network (all your devices together) is called a subnet. It's most like…",
        options: ["A single game", "Your squad, all on the same local team", "A password", "The internet itself"],
        correct_index: 1,
        explanation: "A subnet is your local group of devices, like a squad, that can reach each other, with the router as the way out.",
      },
      {
        prompt: "Why does the Xbox and the PS5 each get their own IP address?",
        options: [
          "So the network can send data to the right console",
          "So they charge faster",
          "So they use less electricity",
          "So they can't play at the same time",
        ],
        correct_index: 0,
        explanation: "IP addresses let the router deliver each stream of data to the correct device.",
      },
      {
        prompt: "Friends come over and want Wi-Fi. The smart setup is…",
        options: [
          "Give them your main password",
          "Put them on a guest network",
          "Turn off your consoles",
          "Unplug the router",
        ],
        correct_index: 1,
        explanation: "A guest network gets visitors online while keeping your main network fast and private.",
      },
      {
        prompt: "Which usually gives less lag for gaming?",
        options: ["Wi-Fi", "A wired ethernet cable", "They're exactly the same", "Bluetooth"],
        correct_index: 1,
        explanation: "Wired ethernet is steadier and lower-lag than Wi-Fi, which can be slowed by walls and distance.",
      },
    ],
  },

  {
    slug: "future-tech-lab-tour",
    title: "Future Tech Lab: Your Hands-On Tour of Tomorrow",
    summary:
      "A guided tour of the tools shaping the future, robots, AI, 3D printing, and satellites, and how they lead to real careers.",
    audience: "Kids & youth",
    level: "intro",
    estimated_minutes: 40,
    program: "future-tech-lab",
    lessons: [
      {
        title: "Welcome to the Lab",
        story_body:
          "The future can feel like magic. It isn't. It's **tools**, real ones, that people learn to use. And in this lab, you get your hands on them.\n\nOver the next few lessons you'll meet four of the biggest: **robots** you can program, **AI** you can direct, **3D printers** that turn your ideas into real objects, and **satellites** streaking across the sky delivering the internet. None of them are out of reach. Kids your age build with every single one.\n\nHere's the one idea to carry through all of it: every piece of 'future tech' is something you can learn to *use*, and the people who use these tools are building the world everyone else lives in. By the end, you'll see how these tools connect to real jobs, and why the visit to a real tech company might be the moment it all clicks.",
        workbook:
          "**Remember this:**\n- Future tech isn't magic, it's **tools people learn to use**.\n- You'll explore robots, AI, 3D printing, and satellites.\n- The people who use these tools build the future, and that can be you.",
      },
      {
        title: "Robots That Listen to You",
        story_body:
          "A robot is just a machine that can **sense** the world, **decide** what to do, and **move**. Three parts make that happen: **sensors** (its senses, like a camera or a distance sensor), **motors** (its muscles, to move), and **code** (its brain, the instructions you write).\n\nHere's the real magic: *you* write the brain. Want a robot to drive forward until it sees a wall, then turn? You tell it, in code: 'if the distance sensor sees something close, turn.' The robot doesn't think on its own, it does exactly what you program.\n\nThat loop, sense, decide, move, is the same whether it's a little classroom robot following a line on the floor or a self-driving car. Learn it small, and you understand the big ones.",
        workbook:
          "**Remember this:**\n- A robot has **sensors** (senses), **motors** (muscles), and **code** (brain).\n- **You** write the code that decides what it does.\n- The loop is always: **sense → decide → move**.\n\n**Try it:** Picture a robot that has to get across a room without hitting anything. What would you tell it to do when a sensor sees a wall?",
      },
      {
        title: "Bossing AI Around",
        story_body:
          "Most people think AI is just a chatbot to ask questions. In this lab, you learn to treat it like something more powerful: **a tool you direct**.\n\nAI can help you write code, brainstorm a design, plan a project, or turn a rough idea into a first draft, if you tell it clearly what you want. The skill isn't 'knowing all the answers,' it's knowing how to **ask well** and how to check the results. That's a skill that's suddenly valuable in almost every job.\n\nThink of AI like a super-fast assistant who's read a lot but needs your direction. You're the one with the vision. AI just helps you get there faster. The people who'll do the best in the years ahead aren't the ones who avoid AI, they're the ones who learn to *steer* it.",
        workbook:
          "**Remember this:**\n- AI is best treated as **a tool you direct**, not just a question box.\n- The skill is **asking clearly** and **checking the results**.\n- You bring the vision; AI helps you get there faster.\n\n**Try it:** Think of a project you'd want help with. What would you ask an AI to do first?",
      },
      {
        title: "From Idea to Object: 3D Printing",
        story_body:
          "A **3D printer** does something that sounds impossible: it turns a design on a screen into a real object you can hold. It builds up an object layer by layer, like drawing the same shape hundreds of times, each one stacked a hair higher, until it becomes solid.\n\nThe process has three steps. First you **design** the object (on a computer, using CAD software, or you start from a drawing). Then you **slice** it, software chops your design into those printable layers. Then you **print**, and watch it come to life over minutes or hours.\n\nThe best part is **iteration**: if the first one isn't right, you tweak the design and print again. Fail, fix, print. That's how real inventors work. An idea in your head at breakfast can be a thing in your hand by dinner.",
        workbook:
          "**Remember this:**\n- A 3D printer builds objects **layer by layer**.\n- The steps: **design → slice → print**.\n- **Iterate**: if it's not right, tweak and print again.\n\n**Try it:** What's one small thing you'd design and print first, a phone stand, a keychain, a game piece?",
      },
      {
        title: "The Internet Overhead",
        story_body:
          "Look up. Right now, thousands of **satellites** are circling the earth, many of them just a couple hundred miles up in what's called **low-Earth orbit**. Some of them are beaming the **internet** down to places that never had a good connection before.\n\nHere's why that matters: for a long time, if you lived somewhere without cables in the ground, you were stuck. Space internet changes that. A dish on a roof can talk to satellites overhead and pull down a fast connection, in a rural town, a mountain village, or a neighborhood the big companies skipped.\n\nThe same networking ideas you might learn elsewhere, sending data from one point to another, work here too, just across space instead of across your house. The internet used to live in wires. Now some of it lives overhead, and you can literally watch it pass.",
        workbook:
          "**Remember this:**\n- Thousands of **satellites** orbit earth; many sit in **low-Earth orbit**.\n- Some beam the **internet** to places cables never reached.\n- It's the same idea as any network, just sending data through space.\n\n**Try it:** On a clear night, a satellite looks like a steady 'star' moving slowly across the sky. See if you can spot one.",
      },
      {
        title: "Inside a Real Tech Company",
        story_body:
          "Here's where it stops being an idea and becomes real: we walk into an actual tech company. You see the machines up close, the labs, the servers, the printers, the robots, and you meet the **people** who run them.\n\nThat's the moment it clicks for a lot of people. The engineer showing you around used to be a kid who was curious, just like you. The person building the app, running the network, designing the parts, they all started somewhere. Seeing them, in the room, doing the work, turns 'a career in tech' from a far-off idea into something you can picture yourself doing.\n\nEverything in this lab, the robots, the AI, the printing, the satellites, has one thing in common: they're **hands-on tools you can learn to use**. Nobody's born knowing them. People *learn* them, one step at a time. You just took the first steps. The future isn't something that happens to you. It's something you build.",
        workbook:
          "**Remember this:**\n- The facility visit lets you see the machines and meet the **people** who do this work.\n- Everyone in tech started as someone curious, like you.\n- Robots, AI, 3D printing, satellites, all **tools you can learn to use**.\n- The future is something you **build**.",
      },
    ],
    questions: [
      {
        prompt: "What are the three parts that let a robot act in the world?",
        options: [
          "Sensors, motors, and code",
          "Battery, screen, and speaker",
          "Wi-Fi, Bluetooth, and GPS",
          "Wheels, paint, and stickers",
        ],
        correct_index: 0,
        explanation: "A robot senses with sensors, moves with motors, and decides with the code you write, sense, decide, move.",
      },
      {
        prompt: "What's the best way to think about AI in this lab?",
        options: [
          "A tool you direct to help you build and create",
          "A robot that walks around",
          "A printer for objects",
          "A satellite in space",
        ],
        correct_index: 0,
        explanation: "AI is most powerful when you direct it clearly and check its work, you bring the vision.",
      },
      {
        prompt: "What does a 3D printer let you do?",
        options: [
          "Turn a digital design into a real object you can hold",
          "Send the internet through space",
          "Program a robot",
          "Charge your phone",
        ],
        correct_index: 0,
        explanation: "A 3D printer builds a real object layer by layer from a design, idea to object.",
      },
      {
        prompt: "How does space internet reach places that cables never did?",
        options: [
          "Through satellites in low-Earth orbit",
          "Through underground tunnels",
          "Through 3D printers",
          "Through robots",
        ],
        correct_index: 0,
        explanation: "Satellites overhead beam the internet down, reaching areas that wired connections skipped.",
      },
      {
        prompt: "Why do we visit a real tech company?",
        options: [
          "To meet the people doing these jobs and see it's real",
          "To buy new phones",
          "To take a nap",
          "Because it's required by law",
        ],
        correct_index: 0,
        explanation: "Seeing the machines and the people turns 'a career in tech' from an idea into something you can picture yourself doing.",
      },
      {
        prompt: "What do robotics, AI, 3D printing, and satellites all have in common here?",
        options: [
          "They're hands-on tools you can learn to use",
          "They only work in space",
          "They're too hard for anyone to learn",
          "They all need the same cable",
        ],
        correct_index: 0,
        explanation: "Every one of them is a tool people learn, step by step, and that can be you.",
      },
    ],
  },
];

async function seed() {
  console.log("🌱 Seeding courses...\n");
  for (const c of COURSES) {
    const { data: existing } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", c.slug)
      .maybeSingle();
    if (existing) {
      console.log(`↷ Skipping "${c.title}" (slug ${c.slug} already exists)`);
      continue;
    }

    const { data: course, error } = await supabase
      .from("courses")
      .insert({
        title: c.title,
        slug: c.slug,
        summary: c.summary,
        audience: c.audience,
        level: c.level,
        estimated_minutes: c.estimated_minutes,
        status: "published",
        ai_generated: false,
        pass_threshold: 70,
      })
      .select("id")
      .single();
    if (error || !course) {
      console.error(`✗ Failed to create "${c.title}":`, error?.message);
      continue;
    }

    await supabase.from("course_lessons").insert(
      c.lessons.map((l, i) => ({
        course_id: course.id,
        position: i,
        title: l.title,
        story_body: l.story_body,
        workbook: l.workbook,
      }))
    );

    await supabase.from("quiz_questions").insert(
      c.questions.map((q, i) => ({
        course_id: course.id,
        lesson_id: null,
        position: i,
        prompt: q.prompt,
        type: "multiple_choice",
        options: q.options,
        correct_index: q.correct_index,
        explanation: q.explanation,
      }))
    );

    await supabase.from("course_program_assignments").insert({
      course_id: course.id,
      program: c.program,
      position: 0,
      status: "active",
    });

    console.log(
      `✓ Created "${c.title}" → ${c.program} (${c.lessons.length} lessons, ${c.questions.length} questions)`
    );
  }
  console.log("\n✅ Done.");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
