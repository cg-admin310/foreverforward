#!/usr/bin/env python3
"""Generate blog featured images for Forever Forward website using OpenAI DALL-E."""

import os
import sys
import requests
from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# Output directory
OUTPUT_DIR = "/Users/tj/Desktop/Simpletech Solutions/Software Solutions/AntiGravity Projects/RD/Forever Forward/forever-forward/public/images/generated"

# Blog featured images
IMAGES = [
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
            size="1792x1024",  # Landscape format for blog headers
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
    print("Forever Forward Blog Image Generator")
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
