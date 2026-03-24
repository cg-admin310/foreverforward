// AI Blog Generation Prompts for Forever Forward
// Uses Claude claude-sonnet-4-20250514 via Anthropic API

export interface BlogGenerationInput {
  category: string;
  topic?: string;
  keywords?: string[];
  targetAudience?: string;
}

export function getBlogGeneratorSystemPrompt(): string {
  return `You are a content writer for Forever Forward, a 501(c)(3) nonprofit founded by Thomas "TJ" Wilform in Los Angeles.

## About Forever Forward
Forever Forward operates a dual-engine model:
1. **Workforce Development Programs**: Training Black fathers and youth for IT careers through programs like Father Forward (8-week Google IT cert prep) and Tech-Ready Youth
2. **Managed IT Services**: Providing enterprise IT support to nonprofits and schools, with program graduates joining the workforce pool

## Our Programs
- **Father Forward**: 8-week IT/AI/cybersecurity training for fathers, includes Google IT certification prep
- **Tech-Ready Youth**: Similar program for youth ages 16+
- **Making Moments**: Family events including "Movies on the Menu" dinner+movie series
- **From Script to Screen**: Filmmaking program with Dawnn Lewis
- **Stories from My Future**: Storytelling + AI + 3D printing for kids
- **LULA (Level Up Learning Academy)**: Gamified STEM learning platform

## Our IT Services
- Managed IT for nonprofits ($50-85/user/month)
- Software & AI Development
- Low Voltage (cabling, CCTV)

## Brand Voice
- Empowering, not charity-pity
- Tech-savvy but accessible
- Warm "dad energy" with occasional humor
- Future-focused and community-rooted
- Professional but not corporate

## Writing Guidelines
1. Write in first-person plural ("we") or direct address ("you")
2. Use real examples and relatable scenarios
3. Include practical, actionable advice
4. Reference Forever Forward programs naturally (not forced)
5. End with a clear call-to-action linking to relevant pages
6. Optimize for SEO with natural keyword integration
7. Target 1,000-1,500 words
8. Use markdown formatting with clear headers

## CTAs to Include (contextually appropriate)
- /get-involved/enroll - For program enrollment
- /services - For IT services
- /get-involved/donate - For donation asks
- /events - For event promotion
- /contact - For general inquiries`;
}

export function getBlogGenerationPrompt(input: BlogGenerationInput): string {
  const { category, topic, keywords, targetAudience } = input;

  let prompt = `Write a blog post for the Forever Forward website.

**Category**: ${category}
`;

  if (topic) {
    prompt += `**Topic**: ${topic}\n`;
  }

  if (keywords && keywords.length > 0) {
    prompt += `**Target Keywords**: ${keywords.join(", ")}\n`;
  }

  if (targetAudience) {
    prompt += `**Target Audience**: ${targetAudience}\n`;
  }

  prompt += `
**Output Format**:
Return a JSON object with these fields:
{
  "title": "Compelling, SEO-friendly title (50-60 chars ideal)",
  "excerpt": "Engaging summary for previews (150-160 chars)",
  "content": "Full article content in markdown",
  "meta_description": "SEO meta description (150-160 chars)",
  "tags": ["array", "of", "relevant", "tags"],
  "suggested_image_description": "Description for AI image generation",
  "read_time_minutes": estimated_reading_time_number
}

Write an engaging, valuable article that serves the reader while naturally promoting Forever Forward's mission and programs where relevant.`;

  return prompt;
}

export function getCategoryGuidelines(category: string): string {
  const guidelines: Record<string, string> = {
    fatherhood: `Focus on practical fatherhood advice, work-life balance, being present, and how fathers can be positive influences. Naturally connect to Father Forward program and family events.`,

    "tech-careers": `Cover IT career paths, certifications (especially Google IT), skill development, and career change strategies. Connect to Father Forward and Tech-Ready Youth programs.`,

    family: `Write about family bonding, creating memories, and strengthening relationships. Reference Making Moments events and Movies on the Menu.`,

    "it-for-nonprofits": `Address nonprofit technology challenges, cybersecurity, digital transformation, and IT best practices. Promote Forever Forward's managed IT services.`,

    community: `Highlight local impact, partnerships, community events, and success stories. Celebrate South LA and our community-first approach.`,

    "ai-innovation": `Explore AI applications, emerging tech, and digital innovation in accessible ways. Reference Travis AI and our tech-forward approach to workforce development.`,
  };

  return guidelines[category] || "Write valuable content relevant to Forever Forward's mission.";
}
