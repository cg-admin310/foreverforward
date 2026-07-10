// Sample blog data for initial development
// This will be replaced with Supabase queries

export const BLOG_CATEGORIES = [
  {
    id: "1",
    name: "Fatherhood & Leadership",
    slug: "fatherhood",
    description: "Stories, advice, and resources for fathers on their journey",
  },
  {
    id: "2",
    name: "Tech Careers",
    slug: "tech-careers",
    description: "Career pathways, certifications, and skilled-trade insights for fathers",
  },
  {
    id: "3",
    name: "Family Activities",
    slug: "family",
    description: "Building stronger families and creating lasting memories",
  },
  {
    id: "4",
    name: "Future Tech",
    slug: "future-tech",
    description: "Robotics, 3D printing, satellites, and the technologies shaping tomorrow",
  },
  {
    id: "5",
    name: "Community Stories",
    slug: "community",
    description: "Community events, partnerships, and local impact stories",
  },
  {
    id: "6",
    name: "AI & Innovation",
    slug: "ai-innovation",
    description: "Exploring AI, emerging tech, and what it means for our neighborhoods",
  },
];

export const SAMPLE_POSTS = [
  {
    id: "1",
    slug: "when-kids-meet-robots-everything-changes",
    title: "When a Kid Races a Robot They Built, Everything Changes",
    excerpt:
      "Talent is everywhere. Exposure isn't. Here's what happens the first time a young person in South LA builds a robot with their own hands, and why that moment matters more than any lecture about the future.",
    content: `
# When a Kid Races a Robot They Built, Everything Changes

There's a moment we watch for at every Future Builders workshop. A kid, sometimes nine years old, sometimes sixteen, presses a button, and a robot they wired, coded, and argued with for two hours finally rolls across the floor. Their whole face changes. That's the moment "someday" becomes "why not me?"

## Exposure Is the Whole Ballgame

Most of the kids we work with are plenty smart. What they haven't had is proximity. Robotics kits, AI tools, 3D printers: these things live in schools and zip codes that aren't theirs. So the future feels like something that happens to other people, somewhere else.

We flip that. At Forever Forward, robotics isn't a video on a screen. It's a motor in your hand, a sensor that won't cooperate, a race at the end of the day where your build goes wheel-to-wheel with your best friend's. Losing the race and immediately asking "can I fix my code and go again?" That's engineering. That's the whole discipline, learned in an afternoon.

## What Actually Changes

It's not that every kid who races a robot becomes a robotics engineer. It's that the ceiling moves. After a workshop, kids talk differently. They say "when I build" instead of "if I could." They ask what jobs let you do this all day. Parents tell us their kid came home and took apart a remote control, which, yes, we apologize for.

Research on career development backs this up: young people mostly aspire to careers they've *seen*. You can't want a job you don't know exists. Every robot race quietly expands the list of futures a kid considers theirs.

## Dads in the Room

Here's our favorite part: at our family events, the fathers don't sit on the sidelines. Dads end up elbow-deep in the build, debating gear ratios with their kids. A father and child solving a problem together as equals: that's a memory with a long shelf life, and it's exactly the kind of moment our [Making Moments](/events) events are built around.

## Put a Robot in Your Kid's Hands

Our [Tech-Ready Youth](/programs/tech-ready-youth) program and Future Builders workshops run across Greater LA, and no experience is required. Curiosity is the only prerequisite. [Enroll your young builder today](/get-involved/enroll), or [come to a robot race](/events) and watch the moment happen yourself.
    `,
    category: BLOG_CATEGORIES[3],
    author_name: "TJ Wilform",
    published_at: "2026-06-18T10:00:00Z",
    read_time_minutes: 5,
    featured_image_url: "/images/future/pillar-future-tech.jpg",
    tags: ["robotics", "future-builders", "youth", "exposure"],
    status: "published",
  },
  {
    id: "2",
    slug: "three-career-pathways-for-fathers",
    title: "Three Career Pathways for Fathers: IT, Skilled Trades, and Auto/EV",
    excerpt:
      "Career Forward isn't one-size-fits-all. Whether you're drawn to servers, pipe wrenches, or electric vehicles, there's a pathway built for you, and all three lead to real wages and real pride.",
    content: `
# Three Career Pathways for Fathers: IT, Skilled Trades, and Auto/EV

Let's be honest: going back to school for a four-year degree isn't realistic for most working fathers. Between family responsibilities, current jobs, and bills that don't pause for anybody, the traditional path can feel closed. That's why Career Forward offers three doors instead of one, each built around skills employers are hiring for right now.

## Pathway One: IT & Cybersecurity

The IT pathway starts from zero: no degree, no prior tech job required. Over twelve weeks you build toward the CompTIA ITF+ certification: networks, operating systems, troubleshooting, and security fundamentals. You'll hear from guest speakers who do this work for a living, and you'll spend a day inside a working data center. Our founder built those rooms for years, so he knows where the doors are. Help desk and IT support roles are the front door to a whole industry, and cybersecurity sits right behind it, with demand that keeps outrunning supply. If you like solving puzzles and you're the person your family already calls when the Wi-Fi acts up, this one's for you.

## Pathway Two: Plumbing & Skilled Trades

Here's a fact that doesn't get enough airtime: the trades are facing a generational shortage. Every building in Los Angeles has pipes, and somebody trustworthy has to keep them working. Our trades pathway teaches apprenticeship-ready fundamentals: tools, codes, safety, and the professionalism that gets you hired onto a crew. Trades pay real wages, can't be outsourced to another continent, and put you on a path toward running your own business someday. Legacy, with a pipe wrench.

## Pathway Three: Auto & EV Mechanics

Cars are turning into computers on wheels, and the shops that service them need people trained on both. This pathway covers diagnostics and repair on today's vehicles plus the electric-vehicle skills the next generation of garages is actively hiring for. California is going electric fast, and the fathers who train on EV systems now will be the senior techs everyone calls in five years.

## Which Door Is Yours?

There's no wrong answer, and you don't have to decide alone. Every [Father Forward](/programs/father-forward) cohort includes leadership coaching, a community of fathers walking the same road, and support for childcare, transportation, schedules, and the other real-life barriers that derail good intentions.

Pick a path. Build a legacy. [Enroll today](/get-involved/enroll). The next cohort has a seat with your name on it.
    `,
    category: BLOG_CATEGORIES[1],
    author_name: "TJ Wilform",
    published_at: "2026-06-05T09:00:00Z",
    read_time_minutes: 6,
    featured_image_url: "/images/future/program-trades-pathway.jpg",
    tags: ["career-forward", "father-forward", "trades", "ev-mechanics", "it-careers"],
    status: "published",
  },
  {
    id: "3",
    slug: "movies-on-the-menu-bringing-families-together",
    title: "Movies on the Menu: Your Only Job Is to Be There",
    excerpt:
      "Our signature family night combines a real dinner, a great film, and a community that shows up for each other. Here's why families keep coming back, and why joy is part of our strategy.",
    content: `
# Movies on the Menu: Your Only Job Is to Be There

There's something about watching a movie with your family. Add a hot dinner you didn't have to cook, a crowd of neighbors who share your values, and zero pressure to be anywhere else, and you've got Movies on the Menu.

## More Than Dinner and a Movie

Movies on the Menu started with a simple idea: what if a father could just *be present* for one evening? No logistics, no cost, no stress. We handle the food, the film, and the setup. Dad handles the popcorn negotiations.

Every event features a family-friendly movie chosen to spark conversation, a dinner themed to the film, and a room full of families building the same thing you are. It's father-focused by design, because we believe a dad laughing with his kids in public is one of the most underrated sights in any neighborhood.

## Why Joy Is a Strategy

At Forever Forward we say it plainly: joy is a strategy. Strong families aren't built in classrooms alone. They're built in moments. The father grinding through a [Career Forward](/programs/father-forward) certification needs a night where the only assignment is being there. The kid who raced a robot at our last workshop needs to see that celebration is part of the culture, not a reward you have to earn.

In a world of streaming alone in separate rooms, we're bringing back the shared experience: eating together, laughing together, groaning at the same dad joke together.

## What to Expect

Doors open, dinner's served, the movie rolls, and nobody checks a watch. Kids are welcome, seconds are encouraged, and yes, there's usually a 3D-printing corner or a robot demo nearby, because we can't help ourselves.

## Pull Up a Chair

Movies on the Menu events fill up fast. Check the [events page](/events) for the next one, and if your family's never been, this is your invitation. Come hungry.
    `,
    category: BLOG_CATEGORIES[2],
    author_name: "TJ Wilform",
    published_at: "2026-05-20T14:00:00Z",
    read_time_minutes: 4,
    featured_image_url: "/images/generated/blog-movies-dinner.png",
    tags: ["movies-on-the-menu", "family", "events", "making-moments"],
    status: "published",
  },
  {
    id: "4",
    slug: "tracking-satellites-from-south-la",
    title: "Tracking Satellites from a South LA Rooftop: A Low Earth Orbit Primer",
    excerpt:
      "Thousands of satellites pass over Los Angeles every single day. With a free app and a clear evening, your family can watch them go by. Here's the science, and the spark.",
    content: `
# Tracking Satellites from a South LA Rooftop: A Low Earth Orbit Primer

Here's a secret hiding in plain sight: the space age flies over your house every night. Thousands of satellites in low Earth orbit, including the International Space Station, pass above Los Angeles daily, visible to the naked eye if you know when to look up. No telescope required. No permission needed.

## What Is Low Earth Orbit, Anyway?

Low Earth orbit (LEO) is the band of space from roughly 100 to 1,200 miles up. It's where the ISS lives, where most imaging and internet satellites operate, and where objects move so fast they circle the entire planet in about 90 minutes. That means the astronauts overhead see a sunrise every hour and a half, and it means a satellite that passes over Compton tonight will pass over again before bedtime.

When you spot one, you're not seeing lights on the spacecraft. You're seeing sunlight glinting off its panels while you stand in the dark. A mirror, 250 miles up, moving at 17,500 miles per hour.

## The Rooftop Setup

At our Night Sky Nights, the gear list is short: a free satellite-tracking app, a clear patch of sky, and patience measured in minutes, not hours. The app tells you exactly when the ISS will rise, which direction to face, and how bright it'll be. Then the countdown starts. And when that steady golden dot slides across the sky right on schedule, on a path a kid predicted from a phone in their hand, something clicks.

Because that's the real lesson: this is *predictable*. It's math. And the kid who just predicted it did the same fundamental thing aerospace engineers do in El Segundo, twenty minutes from here, for a living.

## From Looking Up to Building Up

The space economy is hiring engineers, technicians, coders, and machinists, and much of it is headquartered right here in Southern California. Our [Future Builders programs](/programs/tech-ready-youth) use satellite tracking as a doorway into orbital mechanics, radio, and data skills, and our [Making Moments](/events) events turn it into family ritual.

Come look up with us. Check [upcoming events](/events) for the next Night Sky Night. The ISS will be right on time.
    `,
    category: BLOG_CATEGORIES[3],
    author_name: "TJ Wilform",
    published_at: "2026-04-28T11:00:00Z",
    read_time_minutes: 5,
    featured_image_url: "/images/future/program-satellite-kids.jpg",
    tags: ["low-earth-orbit", "satellites", "night-sky", "stem"],
    status: "published",
  },
  {
    id: "5",
    slug: "a-fathers-journey-from-enrollment-to-certification",
    title: "From 'I'm Not a Tech Guy' to Certified: A Father's Journey",
    excerpt:
      "Twelve weeks ago he almost didn't fill out the form. This is what the road from enrollment to certification actually looks like for a father in Career Forward: doubts, breakthroughs, and all.",
    content: `
# From "I'm Not a Tech Guy" to Certified: A Father's Journey

Every cohort starts the same way: a room full of fathers quietly wondering if they belong there. This is the story of what happens next, told through the journey we watch fathers make every twelve weeks, from the night they almost don't submit the enrollment form to the day a certificate prints with their name on it.

## Week Zero: The Form

The hardest click is the first one. Most of the fathers who join [Career Forward](/programs/father-forward) tell us some version of the same thing: "I'm not a tech guy." They're working a job that doesn't quite cover the bills, or between jobs, or watching their kids grow up faster than their paycheck. The enrollment form asks about goals and barriers like childcare, transportation, and schedule, not because we're screening people out, but because we plan around real life, not an idealized version of it.

## Weeks One Through Four: The Wall

The early weeks are humbling. New vocabulary, new tools, a brain that hasn't sat in a classroom in fifteen years. This is where the cohort matters most. When one father cracks a networking concept, he explains it to the guy next to him in language no textbook uses. Fathers push each other through the wall the same way they'd spot each other in a gym.

## Weeks Five Through Eleven: The Shift

Somewhere in the middle, the identity changes before the certificate does. He starts fixing things at home, first the router, then a neighbor's laptop, narrating what he's doing to his kids while they watch. His daughter starts saying "my dad works in computers." He doesn't correct her anymore.

This stretch is also where the doors swing open. Guest speakers roll through, techs and engineers who started exactly where he's sitting, and the cohort spends a day inside a working data center: racks, cabling, cold aisles, the physical internet humming. Fathers walk in curious and walk out talking about the room like they might run one.

## Week Twelve: The Name on the Certificate

Exam day is quiet. Then it isn't. Passing an industry certification as a grown man with kids watching is a different kind of victory. It's proof, printable and frameable, that forward is a direction available to anyone. Graduates leave with a credential, a network of brothers from the cohort, and a story their kids will retell.

## Your Week Zero Is Now

Whether your door is IT, the skilled trades, or auto and EV mechanics, the road looks like this: hard, supported, and worth it. [Enroll in Career Forward](/get-involved/enroll). The form takes ten minutes. The identity shift takes twelve weeks.
    `,
    category: BLOG_CATEGORIES[0],
    author_name: "TJ Wilform",
    published_at: "2026-04-10T08:00:00Z",
    read_time_minutes: 6,
    featured_image_url: "/images/future/program-it-pathway.jpg",
    tags: ["fatherhood", "career-forward", "certification", "transformation"],
    status: "published",
  },
  {
    id: "6",
    slug: "nonprofits-joining-forces-on-technology",
    title: "Stronger Together: How Nonprofits Can Join Forces on Technology",
    excerpt:
      "We build apps and share tech know-how with fellow nonprofits, not as a vendor but as a neighbor. Here's why collaboration beats going it alone, and how your organization can plug in.",
    content: `
# Stronger Together: How Nonprofits Can Join Forces on Technology

Every nonprofit leader we know is doing three jobs with the budget for one. And somewhere on the to-do list, below payroll and above "someday," sits technology: the intake form that's still on paper, the resource list living in someone's head, the website from 2017.

Here's what we believe at Forever Forward: no community organization should have to solve that alone, and nobody should have to hire their way out of it.

## Collaboration, Not Contracts

Forever Forward builds apps and shares technology *with* fellow nonprofits. Emphasis on with. We're not selling services; we're pooling strengths. We happen to have technical muscle in-house and a founder who spent years building data centers. Your organization has deep roots, trust, and expertise we don't. When we join forces, both missions get bigger.

We've seen what happens when the community-resource space levels up together: the housing org's intake connects to the mentoring org's referrals, the food program's calendar reaches the families the youth program serves. One connected network of organizations serving the same neighborhoods, instead of a dozen islands.

## What Joining Forces Looks Like

**Community apps, built together.** We co-design and build tools around your actual workflow (intake, referrals, scheduling) with your staff at the table from day one.

**Shared know-how.** Workshops and honest advice on AI, automation, and security for partner organizations. The same technologies we teach our fathers and youth, translated for nonprofit operations.

**Shared programming.** Co-hosted events, cross-referrals, and workshops that bring our [Future Builders](/programs/tech-ready-youth) and [Making Moments](/events) energy to the families you serve.

## The Multiplier Effect

When one organization levels up, everyone it serves levels up with it. A caseworker who saves five hours a week on paperwork spends those five hours with families. That's the math we care about.

## Let's Talk

If you lead a nonprofit, school, or community organization in Greater LA (or anywhere, honestly), we'd love to compare notes. [Join forces with us](/get-involved/partner) or [reach out directly](/contact). The whole neighborhood rises together.
    `,
    category: BLOG_CATEGORIES[4],
    author_name: "TJ Wilform",
    published_at: "2026-03-22T10:00:00Z",
    read_time_minutes: 5,
    featured_image_url: "/images/future/community-builders.jpg",
    tags: ["community", "partnerships", "nonprofit-tech", "collaboration"],
    status: "published",
  },
];

export function getPublishedPosts() {
  return SAMPLE_POSTS.filter((post) => post.status === "published").sort(
    (a, b) =>
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
}

export function getPostBySlug(slug: string) {
  return SAMPLE_POSTS.find((post) => post.slug === slug);
}

export function getPostsByCategory(categorySlug: string) {
  return getPublishedPosts().filter(
    (post) => post.category?.slug === categorySlug
  );
}

export function getCategoryBySlug(slug: string) {
  return BLOG_CATEGORIES.find((cat) => cat.slug === slug);
}

export function getFeaturedPost() {
  return getPublishedPosts()[0];
}

export function getRecentPosts(limit: number = 3) {
  return getPublishedPosts().slice(0, limit);
}
