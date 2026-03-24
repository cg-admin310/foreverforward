// Sample blog data for initial development
// This will be replaced with Supabase queries

export const BLOG_CATEGORIES = [
  {
    id: "1",
    name: "Fatherhood",
    slug: "fatherhood",
    description: "Stories, advice, and resources for fathers on their journey",
  },
  {
    id: "2",
    name: "Tech Careers",
    slug: "tech-careers",
    description: "IT career tips, certifications, and industry insights",
  },
  {
    id: "3",
    name: "Family",
    slug: "family",
    description: "Building stronger families and creating lasting memories",
  },
  {
    id: "4",
    name: "IT for Nonprofits",
    slug: "it-for-nonprofits",
    description: "Technology solutions and best practices for nonprofit organizations",
  },
  {
    id: "5",
    name: "Community",
    slug: "community",
    description: "Community events, partnerships, and local impact stories",
  },
  {
    id: "6",
    name: "AI & Innovation",
    slug: "ai-innovation",
    description: "Exploring AI, emerging tech, and digital transformation",
  },
];

export const SAMPLE_POSTS = [
  {
    id: "1",
    slug: "why-google-it-certification-matters",
    title: "Why the Google IT Support Certificate Can Change Your Life",
    excerpt:
      "For fathers looking to break into tech, the Google IT Support Professional Certificate offers a direct path to a new career. Here's why it's become the gold standard for career changers.",
    content: `
# Why the Google IT Support Certificate Can Change Your Life

For fathers looking to break into tech, the Google IT Support Professional Certificate offers a direct path to a new career. Here's why it's become the gold standard for career changers.

## The Problem with Traditional Education

Let's be honest: going back to school for a 4-year degree isn't realistic for most working fathers. Between family responsibilities, current jobs, and financial constraints, the traditional path to a tech career seems impossible.

That's where industry certifications come in.

## What Makes Google IT Different

The Google IT Support Professional Certificate was designed specifically for people with zero prior experience. You don't need a degree. You don't need previous IT work. You just need dedication and 3-6 months of consistent effort.

### What You'll Learn

- **Technical Support Fundamentals**: The basics of IT support that every tech professional needs
- **Computer Networking**: How the internet works and how to troubleshoot network issues
- **Operating Systems**: Windows and Linux administration
- **System Administration**: Managing IT infrastructure
- **IT Security**: Protecting systems from cyber threats

## Real Results from Real Fathers

At Forever Forward, we've seen dozens of fathers complete this certification and launch new careers. The average starting salary for our graduates is $45,000-$55,000, with many advancing to $70,000+ within two years.

## How Forever Forward Helps

Our Father Forward program doesn't just hand you a certificate—we provide:

- **Structured cohort learning** with peers on the same journey
- **Travis AI** support available 24/7 for questions and encouragement
- **Case worker guidance** to help overcome barriers
- **Job placement assistance** with our employer network
- **Ongoing community** even after graduation

## Take the First Step

The hardest part is starting. But with the right support system, you can build a career that provides for your family and serves as an example for your children.

[Enroll in Father Forward today](/get-involved/enroll) and join our next cohort.
    `,
    category: BLOG_CATEGORIES[1],
    author_name: "TJ Wilform",
    published_at: "2026-03-15T10:00:00Z",
    read_time_minutes: 5,
    featured_image_url: null,
    tags: ["google-it", "certification", "career-change", "father-forward"],
    status: "published",
  },
  {
    id: "2",
    slug: "movies-on-the-menu-bringing-families-together",
    title: "Movies on the Menu: Where Dinner Meets Cinema Magic",
    excerpt:
      "Our signature family event combines gourmet food, great films, and meaningful connections. Discover what makes Movies on the Menu special and why families keep coming back.",
    content: `
# Movies on the Menu: Where Dinner Meets Cinema Magic

There's something magical about watching a movie with your family. Add a delicious meal and a community of people who share your values, and you've got something truly special.

## More Than Just Dinner and a Movie

Movies on the Menu started with a simple idea: what if we could create an experience that brings families closer together while celebrating the joy of food and film?

Every event features:

- **Curated Film Selection**: Family-friendly movies that spark conversation
- **Themed Dinner**: Food inspired by or paired with the film
- **Community Atmosphere**: Meet other families building stronger bonds
- **Father-Focused**: Celebrating the role of fathers in family life

## Why It Works

In a world of streaming and fast food, we're losing the art of shared experiences. Movies on the Menu brings back that togetherness—sitting together, eating together, laughing together.

## Upcoming Events

Check our [events page](/events) for the next Movies on the Menu. Tickets sell out fast!
    `,
    category: BLOG_CATEGORIES[2],
    author_name: "TJ Wilform",
    published_at: "2026-03-10T14:00:00Z",
    read_time_minutes: 3,
    featured_image_url: null,
    tags: ["movies-on-the-menu", "family", "events", "community"],
    status: "published",
  },
  {
    id: "3",
    slug: "managed-it-for-nonprofits-guide",
    title: "The Complete Guide to Managed IT for Nonprofits",
    excerpt:
      "Nonprofits face unique technology challenges with limited budgets. Learn how managed IT services can provide enterprise-level support at nonprofit-friendly prices.",
    content: `
# The Complete Guide to Managed IT for Nonprofits

Running a nonprofit is hard enough without worrying about your technology. Yet IT issues can derail your mission faster than almost anything else.

## The Nonprofit IT Challenge

Most nonprofits face a difficult choice:

1. **DIY IT**: Staff members handle tech issues, taking time away from their actual jobs
2. **Break-Fix Support**: Call someone when things break, pay by the hour
3. **Full-Time IT Staff**: Expensive and often underutilized

There's a better way.

## What is Managed IT?

Managed IT services provide ongoing technology support for a predictable monthly fee. Think of it as having a full IT department without the full-time cost.

### What's Included

- **24/7 Monitoring**: We catch problems before they affect your work
- **Help Desk Support**: Staff can get help when they need it
- **Security Management**: Protection against cyber threats
- **Strategic Planning**: Technology roadmapping for your organization
- **Vendor Management**: We handle your tech vendors so you don't have to

## Why Forever Forward?

We're not just another IT company. As a nonprofit ourselves, we understand your world:

- **Nonprofit Pricing**: Designed for limited budgets
- **Mission-Aligned**: Your success is our success
- **Community Reinvestment**: Our profits fund workforce development programs

## Get Started

Request a [free IT assessment](/services/managed-it) and discover how we can help your organization thrive.
    `,
    category: BLOG_CATEGORIES[3],
    author_name: "TJ Wilform",
    published_at: "2026-03-05T09:00:00Z",
    read_time_minutes: 6,
    featured_image_url: null,
    tags: ["managed-it", "nonprofits", "technology", "IT-services"],
    status: "published",
  },
  {
    id: "4",
    slug: "ai-in-workforce-development",
    title: "How AI is Transforming Workforce Development",
    excerpt:
      "From personalized learning paths to 24/7 support, artificial intelligence is changing how we prepare people for careers. Meet Travis, our AI case manager.",
    content: `
# How AI is Transforming Workforce Development

The future of workforce development isn't just about teaching skills—it's about providing personalized, always-available support that meets people where they are.

## The Challenge of Traditional Programs

Traditional workforce programs have limitations:

- **Fixed schedules** that don't work for everyone
- **One-size-fits-all** curriculum
- **Limited support hours** when case workers go home
- **Resource constraints** that limit individual attention

## Enter Travis: AI That Cares

Travis is Forever Forward's AI case manager. Available 24/7, Travis provides:

### Personalized Support
- Answers questions about the program
- Helps troubleshoot technical challenges
- Provides encouragement during tough moments

### Smart Escalation
- Knows when to bring in human help
- Flags concerns for case workers
- Never tries to replace human connection

### Resource Connection
- Searches our partner database
- Connects participants with relevant services
- Helps overcome barriers to success

## The Human-AI Partnership

Travis doesn't replace our case workers—it extends their reach. When a father has a question at 2 AM, Travis is there. When he needs human support, Travis ensures the case worker knows.

## Experience It Yourself

Enroll in any of our programs to experience how AI can support your journey. [Get started today](/get-involved/enroll).
    `,
    category: BLOG_CATEGORIES[5],
    author_name: "TJ Wilform",
    published_at: "2026-02-28T11:00:00Z",
    read_time_minutes: 4,
    featured_image_url: null,
    tags: ["ai", "travis", "workforce-development", "innovation"],
    status: "published",
  },
  {
    id: "5",
    slug: "being-present-as-a-working-father",
    title: "Being Present: A Working Father's Guide to Quality Time",
    excerpt:
      "Balancing work and family is the eternal struggle. Here are practical strategies from fathers who've learned to be fully present—even with limited time.",
    content: `
# Being Present: A Working Father's Guide to Quality Time

Every working father knows the guilt. You're at work thinking about your kids. You're with your kids thinking about work. You're never fully anywhere.

It doesn't have to be this way.

## Quality Over Quantity

Research consistently shows that the quality of time matters more than quantity. Ten minutes of fully engaged play beats an hour of distracted presence.

### What "Present" Really Means

- **Put the phone away**: Not on silent. Away.
- **Make eye contact**: Get on their level
- **Follow their lead**: Let them direct the play
- **Listen actively**: Repeat back what they say

## Practical Strategies

### 1. Create Rituals
- Morning breakfast together
- Bedtime stories (no exceptions)
- Weekend adventure time

### 2. Leverage Technology Wisely
- Video calls when traveling
- Shared photo albums
- Voice messages throughout the day

### 3. Involve Kids in Your World
- Bring them to work occasionally
- Explain what you do
- Share appropriate challenges and victories

## The Forever Forward Approach

Our programs don't just teach technical skills—we help fathers become better fathers. Through mentorship, community, and intentional programming, we address the whole person.

## Join Our Community

Connect with other fathers committed to being present. [Learn about Making Moments](/programs/making-moments) and our family events.
    `,
    category: BLOG_CATEGORIES[0],
    author_name: "TJ Wilform",
    published_at: "2026-02-20T08:00:00Z",
    read_time_minutes: 5,
    featured_image_url: null,
    tags: ["fatherhood", "work-life-balance", "parenting", "presence"],
    status: "published",
  },
  {
    id: "6",
    slug: "south-la-tech-revolution",
    title: "The Tech Revolution Starting in South LA",
    excerpt:
      "Forget Silicon Valley—the next wave of tech talent is being trained right here in South Los Angeles. Here's how our community is building a different kind of tech pipeline.",
    content: `
# The Tech Revolution Starting in South LA

When people think of tech, they think of San Francisco, Seattle, Austin. They don't think of Compton, Inglewood, or South LA.

It's time to change that.

## The Untapped Potential

South LA has everything needed for a tech revolution:

- **Hungry talent** ready to learn and work hard
- **Community bonds** that support success
- **Real-world experience** that brings unique perspectives
- **Proximity to major employers** throughout Los Angeles

What's been missing is the pipeline—the infrastructure to identify, train, and connect talent with opportunity.

## Building the Pipeline

Forever Forward is building that pipeline through:

### Training Programs
- Father Forward for adult career changers
- Tech-Ready Youth for the next generation
- LULA for ongoing learning

### Industry Partnerships
- Direct relationships with employers
- Apprenticeship opportunities
- Job placement support

### Community Reinvestment
- Our IT services revenue funds programs
- Graduates join our workforce pool
- Success feeds more success

## The Vision

Imagine a South LA where:

- Tech careers are normal, not exceptional
- Local businesses have access to affordable IT support
- Fathers are building generational wealth through skilled careers
- Youth see themselves in technology

That's what we're building.

## Be Part of It

Whether you're looking to learn, hire, or support, there's a place for you. [Contact us](/contact) to get involved.
    `,
    category: BLOG_CATEGORIES[4],
    author_name: "TJ Wilform",
    published_at: "2026-02-15T10:00:00Z",
    read_time_minutes: 4,
    featured_image_url: null,
    tags: ["south-la", "community", "tech", "workforce"],
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
