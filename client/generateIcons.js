// generate-icons.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const inputPath = path.join(__dirname, "public", "logo.png");
const outputDir = path.join(__dirname, "public");

const sizes = [
  // Favicons
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "favicon-64x64.png", size: 64 },

  // Android
  { name: "android-chrome-48x48.png", size: 48 },
  { name: "android-chrome-96x96.png", size: 96 },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 },

  // Apple
  { name: "apple-touch-icon-180x180.png", size: 180 },

  // Windows
  { name: "mstile-150x150.png", size: 150 }
];

const DESIGN = {
  cornerRadiusPercentage: 0.08,
  paddingPercentage: 0.30,
  backgroundColor: { r: 255, g: 255, b: 255 } // Solid white
};

async function createIcons() {
  try {
    if (!fs.existsSync(inputPath)) throw new Error(`Input not found: ${inputPath}`);
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const metadata = await sharp(inputPath).metadata();
    const logoAspectRatio = metadata.width / metadata.height;

    for (const config of sizes) {
      try {
        const outputPath = path.join(outputDir, config.name);
        const size = config.size;
        const width = config.width || size;
        const height = config.height || size;

        const radius = Math.round(Math.min(width, height) * DESIGN.cornerRadiusPercentage);
        const padding = Math.round(Math.min(width, height) * DESIGN.paddingPercentage);

        const maxLogoWidth = width - padding * 2;
        const maxLogoHeight = height - padding * 2;

        let logoWidth, logoHeight;
        if (logoAspectRatio >= 1) {
          logoWidth = Math.floor(Math.min(maxLogoWidth, maxLogoHeight * logoAspectRatio));
          logoHeight = Math.floor(logoWidth / logoAspectRatio);
        } else {
          logoHeight = Math.floor(Math.min(maxLogoHeight, maxLogoWidth / logoAspectRatio));
          logoWidth = Math.floor(logoHeight * logoAspectRatio);
        }

        logoWidth = Math.max(1, logoWidth);
        logoHeight = Math.max(1, logoHeight);

        const top = Math.round((height - logoHeight) / 2);
        const left = Math.round((width - logoWidth) / 2);

        // Create solid white background
        const background = await sharp({
          create: {
            width,
            height,
            channels: 4,
            background: DESIGN.backgroundColor
          }
        }).png().toBuffer();

        // Process logo
        const logo = await sharp(inputPath)
          .resize(logoWidth, logoHeight, {
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .toBuffer();

        // Composite operations
        const compositeOps = [
          { input: background }, // Background first
          { input: logo, top, left } // Logo on top
        ];

        // Add rounded corners if square
        if (width === height) {
          const roundedMask = Buffer.from(`
            <svg width="${width}" height="${height}">
              <rect x="0" y="0" width="${width}" height="${height}" 
                    rx="${radius}" ry="${radius}" fill="white"/>
            </svg>
          `);
          compositeOps.push({
            input: roundedMask,
            blend: "dest-in"
          });
        }

        await sharp(background)
          .composite(compositeOps)
          .png({ compressionLevel: 9, adaptiveFiltering: true })
          .toFile(outputPath);

        console.log(`✅ Created ${config.name} (${width}x${height})`);
      } catch (iconError) {
        console.error(`❌ Failed for ${config.name}:`, iconError.message);
        continue;
      }
    }

    // Create favicon.ico
    try {
      console.log("🔄 Creating favicon.ico...");
      execSync(`convert "${path.join(outputDir, "favicon-16x16.png")}" "${path.join(outputDir, "favicon-32x32.png")}" "${path.join(outputDir, "favicon-64x64.png")}" "${path.join(outputDir, "favicon.ico")}"`);
      console.log("✅ Created favicon.ico");
    } catch (convertError) {
      console.warn("⚠️ Could not create favicon.ico - install ImageMagick (convert).");
    }

    console.log("🎉 All icons generated!");
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

createIcons();