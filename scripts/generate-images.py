#!/usr/bin/env python3
"""Generate images for Forever Forward website using OpenAI DALL-E."""

import os
import sys
import requests
from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# Output directory
OUTPUT_DIR = "/Users/tj/Desktop/Simpletech Solutions/Software Solutions/AntiGravity Projects/RD/Forever Forward/forever-forward/public/images/generated"

# Image prompts for each program
IMAGES = [
    {
        "filename": "program-father-forward.png",
        "prompt": "Professional photography of a confident Black father in his 30s sitting at a modern computer workstation learning IT skills. Code visible on the monitor screen. Professional tech training environment with modern equipment. Warm lighting with gold accent lighting. The man wears business casual attire and has a focused, determined expression. Clean, professional atmosphere. Photorealistic, high quality."
    },
    {
        "filename": "program-tech-ready-youth.png",
        "prompt": "Professional photography of a group of diverse Black teenagers ages 16-20 working together on computers in a modern tech classroom lab. Some students are building a PC showing internal components, others are coding on laptops. Collaborative, energetic atmosphere with gaming tournament vibes. Modern equipment, good lighting. The students look engaged and excited. Photorealistic, high quality."
    },
    {
        "filename": "program-making-moments.png",
        "prompt": "Professional photography of a Black father with his young daughter around age 8 laughing together at a community dinner table. Warm candlelight illuminates their joyful faces. Plates of delicious food on the table. Other families visible in the soft-focus background enjoying dinner. Intimate, heartwarming family moment. Movie night atmosphere. Photorealistic, high quality."
    },
    {
        "filename": "program-script-to-screen.png",
        "prompt": "Professional photography of young Black students of mixed ages working behind a professional video camera on a film set. One student is directing while others operate lighting and sound equipment. Creative, professional film production atmosphere. A movie clapboard is visible. The students look focused and professional. Film studio lighting. Photorealistic, high quality."
    },
    {
        "filename": "program-stories-future.png",
        "prompt": "Professional photography of young Black children ages 6-12 excitedly watching a 3D printer creating their colorful designs. Wonder and amazement on their faces as they see their creations come to life. Colorful creative workshop setting with their drawings visible on the table. Bright, inspiring atmosphere. Photorealistic, high quality."
    },
    {
        "filename": "program-lula-learning.png",
        "prompt": "Professional photography of a Black teenager at home engaged in online learning on a laptop computer. The screen shows a gamified learning interface with achievement badges and progress bars visible. Comfortable home study setup with good lighting. The teenager has a motivated, engaged expression. Modern, aspirational atmosphere. Photorealistic, high quality."
    },
    {
        "filename": "service-managed-it.png",
        "prompt": "Professional photography of a Black IT technician in business casual attire helping a nonprofit office worker with their computer. Modern office environment with servers and network equipment visible in background. Professional, helpful interaction. The technician looks knowledgeable and approachable. Clean, corporate atmosphere with warm lighting. Photorealistic, high quality."
    },
    {
        "filename": "service-software-ai.png",
        "prompt": "Professional photography of a Black software developer working on code displayed on multiple monitors. Modern code editor with AI assistant interface visible. Sleek tech workspace with ambient lighting. The developer looks focused and creative. Futuristic but accessible atmosphere. Lines of code and AI chat visible on screens. Photorealistic, high quality."
    },
    {
        "filename": "service-low-voltage.png",
        "prompt": "Professional photography of a Black technician installing network cabling and security cameras in a modern office building. Professional tools and equipment visible. The technician wears work attire and safety gear. Clean, organized installation work. Blue network cables and professional equipment visible. Technical expertise on display. Photorealistic, high quality."
    },
    {
        "filename": "volunteer-community.png",
        "prompt": "Professional photography of a diverse group of volunteers including Black fathers and community members at a community event. Some are setting up tables, others are greeting families. Warm, welcoming atmosphere at a community center. Everyone looks happy and engaged in helping. Natural lighting, authentic community gathering feel. Photorealistic, high quality."
    },
    {
        "filename": "donate-impact.png",
        "prompt": "Professional photography of a Black father and his young son working together on a laptop computer at home. The father is teaching his son about technology. Warm, inspiring moment of knowledge transfer and bonding. Comfortable home setting with good natural lighting. Both look happy and engaged. Represents the impact of donations. Photorealistic, high quality."
    },
    {
        "filename": "partner-handshake.png",
        "prompt": "Professional photography of two business professionals, including a Black man in business attire, shaking hands in a modern office setting. Partnership and collaboration represented. Professional, corporate atmosphere with warm lighting. Both people look confident and happy about the partnership. Clean, modern office background. Photorealistic, high quality."
    },
    # Blog featured images
    {
        "filename": "blog-google-it-cert.png",
        "prompt": "Professional photography of a Black man in his 30s celebrating with arms raised after passing an IT certification exam. Computer screen in background showing a certificate or 'Congratulations' message. Professional but joyful atmosphere in a testing center or office. The man looks triumphant and proud. Warm lighting. Photorealistic, high quality."
    },
    {
        "filename": "blog-movies-dinner.png",
        "prompt": "Professional photography close-up of a beautifully arranged themed dinner table for a movie night event. Gourmet food, popcorn in bowls, movie-themed decorations. A large movie screen visible softly in the background. Warm, inviting candlelight atmosphere. Family-friendly movie night aesthetic. Rich colors, gold accents. Photorealistic, high quality."
    },
    {
        "filename": "blog-nonprofit-it.png",
        "prompt": "Professional photography of a Black IT professional in business casual helping nonprofit office staff with their computers. Diverse team in a warm, collaborative office setting. Technology supporting mission-driven work. Screens showing productivity software. Helpful, professional interaction. Modern nonprofit office with good lighting. Photorealistic, high quality."
    },
    {
        "filename": "blog-ai-workforce.png",
        "prompt": "Artistic conceptual image representing AI and human workforce development. Abstract glowing neural network patterns in gold and black colors seamlessly connecting with a human silhouette. Modern, hopeful, optimistic atmosphere. Not dystopian but inspirational. Technology empowering humans. Futuristic yet warm. Digital art style, high quality."
    },
    {
        "filename": "blog-present-father.png",
        "prompt": "Professional photography of a Black father sitting on the living room floor playing with his young child around age 5. No phones or devices visible. Natural window light illuminates the scene. Genuine connection and laughter between father and child. Toys scattered around. Warm, intimate family moment at home. Photorealistic, high quality."
    },
    {
        "filename": "blog-south-la-tech.png",
        "prompt": "Artistic photography of South Los Angeles urban landscape with optimistic tech overlay elements. Palm trees, city buildings, with subtle digital circuit patterns and technology elements integrated into the sky. People walking with laptops and briefcases. Sunrise or golden hour lighting. Forward-looking, hopeful vision of tech in South LA. Modern, inspiring. Photorealistic with artistic elements, high quality."
    }
]


def generate_image(prompt: str, filename: str) -> bool:
    """Generate an image using DALL-E 3 and save it."""
    try:
        print(f"Generating: {filename}")
        print(f"Prompt: {prompt[:100]}...")

        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1792x1024",  # Landscape format for hero images
            quality="hd",
            n=1,
        )

        image_url = response.data[0].url

        # Download and save the image
        img_response = requests.get(image_url)
        if img_response.status_code == 200:
            filepath = os.path.join(OUTPUT_DIR, filename)
            with open(filepath, "wb") as f:
                f.write(img_response.content)
            print(f"Saved: {filepath}")
            return True
        else:
            print(f"Failed to download: {filename}")
            return False

    except Exception as e:
        print(f"Error generating {filename}: {e}")
        return False


def main():
    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("=" * 60)
    print("Forever Forward Image Generator")
    print("=" * 60)
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Total images to generate: {len(IMAGES)}")
    print("=" * 60)

    success_count = 0
    for i, image in enumerate(IMAGES, 1):
        print(f"\n[{i}/{len(IMAGES)}] ", end="")
        if generate_image(image["prompt"], image["filename"]):
            success_count += 1

    print("\n" + "=" * 60)
    print(f"Complete! Generated {success_count}/{len(IMAGES)} images.")
    print("=" * 60)


if __name__ == "__main__":
    main()
