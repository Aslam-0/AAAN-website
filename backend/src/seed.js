import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Category from './models/Category.js';
import Blog from './models/Blog.js';

dotenv.config();

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const DEFAULT_CATEGORIES = [
  'Home Decor & Wall Art',
  'Lighting, Lamps & Candles',
  'Cushions, Curtains & Bedding',
  'Idols, Showpieces & Vases',
  'Kitchenware & Dining Decor',
  'Skincare & Beauty',
  'Wellness & Massage',
];

const BLOGS_TO_SEED = [
  {
    title: 'Top 10 Benefits of Using a Body Massager',
    slug: 'top-10-benefits-of-using-a-body-massager',
    metaDescription: 'Discover the top 10 health benefits of using a body massager daily. From stress relief to improved blood circulation and muscle recovery.',
    content: `Using a body massager is one of the easiest and most convenient ways to relieve stress, improve health, and promote recovery. With modern lifestyles becoming increasingly sedentary and stressful, carrying tension in our muscles has become a daily struggle. Here are the top 10 benefits of incorporating a body massager into your wellness routine:

1. **Reduces Stress and Anxiety**: Massages trigger the release of endorphins, the body's natural feel-good chemicals, while reducing cortisol levels (stress hormones).
2. **Improves Blood Circulation**: The mechanical stimulation of an [electric body massager](/products/electric-body-massager) helps dilate blood vessels, ensuring oxygen and essential nutrients are delivered efficiently throughout the body.
3. **Alleviates Muscle Soreness and Pain**: Whether it is post-workout stiffness or chronic backache, a massager target tight knots to release tension.
4. **Enhances Muscle Flexibility**: Regular usage helps loosen stiff muscles, increasing your overall range of motion and flexibility.
5. **Aids in Post-Workout Recovery**: Athletes and fitness enthusiasts use a [deep tissue massager](/products/deep-tissue-massager) to flush out lactic acid and reduce recovery time.
6. **Improves Sleep Quality**: By relaxing the nervous system, a late-evening massage session prepares your body for a deeper, more restful sleep.
7. **Boosts Lymphatic Drainage**: Massaging stimulates lymphatic flow, which helps the body naturally filter and eliminate toxins.
8. **Relieves Tension Headaches**: Massaging the neck and shoulders can relieve the muscular tension that often triggers painful tension headaches.
9. **Offers Convenience and Cost Savings**: Instead of booking expensive spa sessions, a portable massager provides instant relief in the comfort of your home.
10. **Customizable Therapy**: With adjustable speeds and various massage heads, you can target specific pressure points with precision.

Integrating a high-quality massager into your lifestyle can drastically improve your overall physical and mental well-being. Browse our premium collection of wellness products at Afsha Enterprises today!`,
    image: '/masage.jpg',
    tags: ['Body Massager', 'Wellness', 'Pain Relief', 'Self Care'],
  },
  {
    title: 'Best Massager for Back Pain in India',
    slug: 'best-massager-for-back-pain-in-india',
    metaDescription: 'Suffering from back pain? Read our expert guide on the best body massagers for back pain relief in India, featuring top electric and deep tissue options.',
    content: `Back pain is a widespread issue in India, affecting office workers who sit for long hours, active gym-goers, and senior citizens alike. Finding the right solution is critical to maintaining productivity and quality of life. In this guide, we discuss the best body massagers designed to combat back pain effectively.

### Why Choose an Electric Body Massager for Back Pain?
Traditional massage therapies require manual effort, which is difficult when you are in pain. An [electric body massager](/products/electric-body-massager) automates the process, applying consistent pressure to relieve muscle spasms and improve localized blood flow.

### Key Types of Massagers for Back Pain:
1. **Deep Tissue Percussion Massagers**: These devices use rapid, repetitive pulses to penetrate deep into muscle fibers. If you have chronic lower back stiffness, a [deep tissue massager](/products/deep-tissue-massager) is highly recommended.
2. **Handheld Massagers with Extension Handles**: These allow you to reach difficult spots on your middle and upper back without straining your arms.
3. **Shiatsu Massage Cushions**: Placed on your office chair or car seat, they use rotating nodes to mimic the kneading action of a professional masseuse.

### Tips for Safe Usage:
* **Start Slow**: Always begin with the lowest intensity setting to gauge your body's response.
* **Avoid Bone Areas**: Focus on muscle tissue rather than applying pressure directly to the spine.
* **Stay Hydrated**: Drinking water after a massage helps flush out metabolic waste products released from the muscles.

Afsha Enterprises offers the highest-rated pain relief devices in India. Investing in a dedicated back massager is a step toward a pain-free, active life. Check out our shop to buy yours today.`,
    image: '/bg.jpg',
    tags: ['Back Pain', 'Health', 'Electric Massager', 'India'],
  },
  {
    title: 'How to Choose a Handheld Massager',
    slug: 'how-to-choose-a-handheld-massager',
    metaDescription: 'Buying guide for handheld massagers online. Learn which key features to look for, including battery life, weight, speed settings, and attachments.',
    content: `With so many handheld massagers available online, choosing the right one can feel overwhelming. A handheld massager is a fantastic investment for targeting sore shoulders, calves, back, and neck. However, to get the best value, you must know what features matter most.

### Key Factors to Consider:
1. **Percussion vs. Vibration**:
   * **Percussion massagers** deliver rapid pulses that penetrate deep into the muscles, making them ideal for muscle recovery and deep-seated pain.
   * **Vibration massagers** offer a gentler, surface-level massage that is excellent for relaxation and stress relief.
2. **Speed and Intensity Levels**: Look for a device that offers multiple speed settings (at least 3 to 5) so you can customize your massage depending on the muscle group.
3. **Weight and Ergonomics**: Since you will be holding the device, it should be lightweight (under 1kg) and feature an ergonomic, non-slip handle.
4. **Attachment Heads**: Check if the device includes specialized attachments:
   * *Round Head* for large muscle groups.
   * *Bullet Head* for joint and deep tissue trigger points.
   * *Flat Head* for general body relaxation.
5. **Corded vs. Cordless**: Cordless models offer unparalleled portability but require recharging. Corded models offer constant power but limit your movement.

At Afsha Enterprises, we design our [handheld massagers](/products/electric-body-massager) with premium batteries and multiple speed settings to ensure maximum relief. Visit our product pages to compare options and find the perfect match for your wellness routine.`,
    image: '/masage.jpg',
    tags: ['Buying Guide', 'Handheld Massager', 'Product Comparison'],
  },
  {
    title: 'Neck Pain Relief Tips at Home',
    slug: 'neck-pain-relief-tips-at-home',
    metaDescription: 'Relieve neck and shoulder stiffness at home with these easy exercises, hot therapy tips, and the best neck and shoulder massager machines.',
    content: `Neck pain and shoulder stiffness are common complaints in today's digital age. Hours spent slouching over computers or looking down at smartphones—a condition known as "text neck"—strain the cervical spine and surrounding muscles. Fortunately, you can find relief at home using simple, effective techniques.

### 1. Gentle Stretching Exercises
Perform basic neck rotations, chin tucks, and shoulder rolls daily. These movements reduce stiffness, lengthen tight muscles, and restore normal range of motion.

### 2. Apply Heat or Cold Therapy
* Use an **ice pack** for acute pain or inflammation during the first 48 hours.
* Use a **heating pad** or warm towel thereafter to relax tight muscles and promote blood flow.

### 3. Use a Specialized Neck and Shoulder Massager
If stretching isn't enough, a specialized [neck and shoulder massager](/products/neck-shoulder-massager) can provide targeted relief. These massagers are contoured to fit around your neck, using heated rotating nodes to knead away deep-seated tension.

### 4. Optimize Your Ergonomics
Ensure your computer monitor is at eye level, sit with your shoulders relaxed, and take breaks every 45 minutes to stretch.

Don't let neck stiffness turn into chronic pain. Combining ergonomic adjustments with active massage therapy will keep your upper body relaxed and pain-free. Explore our wellness collection at Afsha Enterprises to find relief tools today.`,
    image: '/bg.jpg',
    tags: ['Neck Pain', 'Home Remedies', 'Ergonomic Tips', 'Wellness'],
  },
  {
    title: 'Electric vs Manual Massagers',
    slug: 'electric-vs-manual-massagers',
    metaDescription: 'Comparison guide between electric massager machines and manual massagers. Understand the pros, cons, and which option is best for your health.',
    content: `When looking for a massage tool, one of the first decisions you will make is choosing between an electric and a manual massager. Both tools have their unique benefits and drawbacks. Let's break down the differences to help you choose the best option for your needs.

### Electric Massagers: Power and Efficiency
[Electric massagers](/products/electric-body-massager) use motorized components to deliver percussion, vibration, or kneading actions.
* **Pros**:
  * **Minimal Effort**: The machine does all the work; you simply hold it against your skin.
  * **Deeper Penetration**: Easily achieves high speeds and forces to target deep muscle tissue.
  * **Advanced Features**: Often include heat therapy, digital screens, and adjustable speeds.
* **Cons**: Higher price point, requires recharging or proximity to a power outlet, and heavier to hold.

### Manual Massagers: Control and Portability
Manual massagers include foam rollers, wooden rollers, and plastic massage sticks that rely entirely on your physical pressure.
* **Pros**:
  * **Absolute Control**: You control the exact pressure and location of the massage.
  * **No Batteries Needed**: Never runs out of power and is highly portable.
  * **Affordable**: Very inexpensive compared to electric counterparts.
* **Cons**: Requires physical effort, which can be exhausting, and cannot replicate the deep percussion speeds of electric motors.

### Verdict
For general relaxation and light stretching, a manual massager is a handy tool. However, for chronic pain relief, muscle recovery, and deep knots, an [electric body massager](/products/electric-body-massager) is superior and offers faster results.

At Afsha Enterprises, we recommend starting with a high-quality electric handheld massager to experience professional-grade therapy at home. Check out our store today to explore our models.`,
    image: '/masage.jpg',
    tags: ['Electric Massager', 'Manual Massager', 'Comparison', 'Wellness'],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/glowora');
    console.log('Connected to MongoDB');

    // Clear old admin/demo users
    await User.deleteMany({ email: { $in: ['admin@glowora.com', 'demo@glowora.com'] } });

    // Create admin and demo user only
    await User.create({
      name: 'Admin',
      email: 'admin@glowora.com',
      password: 'admin123',
      role: 'admin',
    });
    await User.create({
      name: 'Demo User',
      email: 'demo@glowora.com',
      password: 'demo123',
      role: 'user',
    });

    console.log('✓ Admin users created');
    console.log('Admin: admin@glowora.com / admin123');
    console.log('Demo user: demo@glowora.com / demo123');

    // Seed default categories (upsert by slug so re-running is safe)
    for (const name of DEFAULT_CATEGORIES) {
      await Category.findOneAndUpdate(
        { slug: slugify(name) },
        { $setOnInsert: { name, slug: slugify(name) } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log(`✓ ${DEFAULT_CATEGORIES.length} categories ensured`);

    // Seed default blogs (clear and re-seed)
    await Blog.deleteMany({});
    for (const blogData of BLOGS_TO_SEED) {
      await Blog.create(blogData);
    }
    console.log(`✓ ${BLOGS_TO_SEED.length} blogs seeded`);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
