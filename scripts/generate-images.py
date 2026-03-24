#!/usr/bin/env python3
"""
Generate images for Forever Forward website using OpenAI DALL-E
"""

import os
import sys
import requests
from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def generate_image(prompt: str, output_path: str, size: str = "1792x1024"):
    """Generate an image using DALL-E 3"""
    print(f"Generating: {output_path}")
    print(f"Prompt: {prompt[:100]}...")

    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size=size,
            quality="hd",
            n=1,
        )

        image_url = response.data[0].url

        # Download the image
        img_response = requests.get(image_url)
        if img_response.status_code == 200:
            with open(output_path, "wb") as f:
                f.write(img_response.content)
            print(f"✓ Saved: {output_path}")
            return True
        else:
            print(f"✗ Failed to download image")
            return False

    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def main():
    base_path = "/Users/tj/Desktop/Simpletech Solutions/Software Solutions/AntiGravity Projects/RD/Forever Forward/forever-forward/public/images/generated"

    images = [
        {
            "name": "hero-father-tech.png",
            "prompt": """Professional photography of a confident Black father in his mid-30s working at a modern computer workstation in a bright tech office environment. He's focused on his screen showing code or IT systems. The lighting is warm and professional. He's wearing business casual - a nice button-down shirt. The background shows a modern tech office with subtle gold accent lighting. The mood is empowering, professional, and aspirational. The image conveys success, capability, and opportunity. Photorealistic style, high-end professional photography look. Brand colors subtly incorporated: gold (#C9A84C) accents, black (#1A1A1A) elements.""",
            "size": "1792x1024"
        },
        {
            "name": "founder-tj.png",
            "prompt": """Professional headshot portrait of a friendly, approachable Black man in his late 30s. He has a warm, genuine smile that shows he's both a successful tech professional and a caring community leader. He's wearing business casual attire - a crisp navy or charcoal button-down shirt. The background is clean and professional with soft, diffused lighting. His expression is confident but approachable - someone you'd trust to mentor you. High-end professional portrait photography style. The lighting is flattering with soft shadows. He looks like someone who worked in enterprise IT and data centers but also deeply cares about his community. Photorealistic, magazine-quality portrait.""",
            "size": "1024x1024"
        },
        {
            "name": "programs-training.png",
            "prompt": """Professional photography of a diverse group of Black men of various ages (20s-50s) in a modern tech training classroom. They're learning IT skills together, some working on laptops, others engaged in discussion with an instructor. The atmosphere is collaborative, supportive, and engaged. A mentor/instructor (also Black) is helping one student while others work together. The room has modern training equipment, whiteboards with technical diagrams. Natural lighting mixed with warm indoor lighting. The mood is one of empowerment, community, and mutual support. Shows mentorship and brotherhood. Photorealistic professional photography style. Subtle gold (#C9A84C) accent colors in the room decor.""",
            "size": "1792x1024"
        },
        {
            "name": "movies-on-menu.png",
            "prompt": """Warm, joyful professional photography of Black families at a community movie night event called "Movies on the Menu". Black fathers with their children (mix of ages from 5-15, boys and girls) enjoying themselves in a cozy event space. Some are holding popcorn buckets, some have plates with food from a themed dinner. The lighting is warm and atmospheric like a cinema. Large projection screen visible in background. The families are bonding - a dad has his arm around his daughter, another dad is sharing popcorn with his son. The mood is pure joy, connection, and family bonding. Other families visible in background. Tables set up with themed decorations and gold accents. Photorealistic event photography style. Warm amber and gold lighting creates intimate atmosphere.""",
            "size": "1792x1024"
        }
    ]

    success_count = 0
    for img in images:
        output_path = os.path.join(base_path, img["name"])
        if generate_image(img["prompt"], output_path, img["size"]):
            success_count += 1
        print()

    print(f"\n{'='*60}")
    print(f"Generated {success_count}/{len(images)} images successfully")
    print(f"Images saved to: {base_path}")

if __name__ == "__main__":
    main()
