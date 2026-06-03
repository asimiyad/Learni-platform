import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const TEMPLATES = [
  {
    name: "Fractions Basics",
    description: "Learn to identify, compare, and work with fractions through interactive visuals and practice problems.",
    subject: "Mathematics",
    grade: 5,
    difficulty: "BEGINNER",
    category: "arithmetic",
    tags: "fractions, decimals, parts, equal sharing",
    estimatedMinutes: 30,
    totalPoints: 25,
    isFeatured: true,
    sections: [
      {
        title: "What Are Fractions?",
        blocks: [
          {
            blockType: "RICH_TEXT",
            gridWidth: 12,
            config: {
              html: "<h2><span style=\"color: #2563eb\">What is a Fraction?</span></h2><p>A fraction represents a <strong>part of a whole</strong>. It is written as two numbers separated by a line:</p><ul><li>The <strong>numerator</strong> (top) — how many parts you have</li><li>The <strong>denominator</strong> (bottom) — how many equal parts the whole is divided into</li></ul><blockquote><p>Example: <code>3/4</code> means 3 parts out of 4 equal parts</p></blockquote>",
            },
          },
          {
            blockType: "IMAGE",
            gridWidth: 6,
            config: {
              fileId: "/placeholder-fraction.svg",
              altText: "A circle divided into 4 equal parts, 3 are shaded blue",
            },
          },
          {
            blockType: "MULTIPLE_CHOICE",
            gridWidth: 6,
            config: {
              question: "What fraction of the circle is shaded?",
              options: [
                { id: "fc-1", text: "1/4", isCorrect: false },
                { id: "fc-2", text: "3/4", isCorrect: true },
                { id: "fc-3", text: "2/3", isCorrect: false },
                { id: "fc-4", text: "1/2", isCorrect: false },
              ],
              randomize: false,
              points: 5,
            },
          },
        ],
      },
      {
        title: "Comparing Fractions",
        blocks: [
          {
            blockType: "RICH_TEXT",
            gridWidth: 12,
            config: {
              html: "<h2>Comparing Fractions</h2><p>When denominators are the <strong>same</strong>, compare numerators:</p><p><code>3/8 &lt; 5/8</code> (3 parts is less than 5 parts)</p><p>When denominators are <strong>different</strong>, find a common denominator first.</p>",
            },
          },
          {
            blockType: "ORDERING",
            gridWidth: 12,
            config: {
              question: "Arrange these fractions from smallest to largest:",
              items: [
                { id: "o-1", text: "1/2", correctOrder: 2 },
                { id: "o-2", text: "1/4", correctOrder: 0 },
                { id: "o-3", text: "3/4", correctOrder: 3 },
                { id: "o-4", text: "1/8", correctOrder: 1 },
              ],
              points: 10,
            },
          },
        ],
      },
      {
        title: "Quick Check",
        blocks: [
          {
            blockType: "TRUE_FALSE",
            gridWidth: 12,
            config: {
              question: "Is 5/8 greater than 3/8?",
              options: [
                { id: "tf-1", text: "True", isCorrect: true },
                { id: "tf-2", text: "False", isCorrect: false },
              ],
              points: 5,
            },
          },
          {
            blockType: "RICH_TEXT",
            gridWidth: 12,
            config: {
              html: "<p style=\"text-align: center;\"><strong>Great job!</strong> Fractions are everywhere — pizza slices, measurements, and time!</p>",
            },
          },
        ],
      },
    ],
  },
  {
    name: "Plant Life Cycle",
    description: "Explore how plants grow from seeds to full maturity with engaging diagrams and experiments.",
    subject: "Science",
    grade: 5,
    difficulty: "BEGINNER",
    category: "biology",
    tags: "plants, germination, photosynthesis, seeds, growth",
    estimatedMinutes: 35,
    totalPoints: 30,
    isFeatured: true,
    sections: [
      {
        title: "From Seed to Plant",
        blocks: [
          {
            blockType: "RICH_TEXT",
            gridWidth: 12,
            config: {
              html: "<h2><span style=\"color: #16a34a\">The Plant Life Cycle</span></h2><p>Every plant begins as a tiny <strong>seed</strong>. When conditions are right, the seed <strong>germinates</strong> and grows into a seedling, then into a mature plant that produces its own seeds.</p><p>The stages are:</p><ol><li><strong>Seed</strong> — contains the embryo and food supply</li><li><strong>Germination</strong> — the seed sprouts roots and a shoot</li><li><strong>Seedling</strong> — young plant with first leaves</li><li><strong>Mature plant</strong> — fully grown with flowers</li><li><strong>Fruit &amp; seeds</strong> — new seeds ready for the next cycle</li></ol>",
            },
          },
          {
            blockType: "IMAGE",
            gridWidth: 12,
            config: {
              fileId: "/placeholder-lifecycle.svg",
              altText: "Diagram showing the 5 stages of a plant's life cycle in a circle",
            },
          },
        ],
      },
      {
        title: "What Plants Need",
        blocks: [
          {
            blockType: "RICH_TEXT",
            gridWidth: 8,
            config: {
              html: "<h3>Essential Requirements</h3><p>Plants need <strong>five things</strong> to grow:</p><ul><li>🌞 <strong>Sunlight</strong> — for photosynthesis</li><li>💧 <strong>Water</strong> — transports nutrients</li><li>🌱 <strong>Soil</strong> — provides minerals and support</li><li>🌬️ <strong>Air</strong> — carbon dioxide for food-making</li><li>🌡️ <strong>Warmth</strong> — right temperature for growth</li></ul>",
            },
          },
          {
            blockType: "MULTIPLE_CHOICE",
            gridWidth: 4,
            config: {
              question: "What is the process called when plants make their own food?",
              options: [
                { id: "pc-1", text: "Respiration", isCorrect: false, feedback: "Respiration is different!" },
                { id: "pc-2", text: "Photosynthesis", isCorrect: true, feedback: "Correct! Plants use sunlight to make food." },
                { id: "pc-3", text: "Germination", isCorrect: false, feedback: "Germination is the sprouting stage." },
                { id: "pc-4", text: "Pollination", isCorrect: false, feedback: "Pollination involves flowers and bees." },
              ],
              randomize: true,
              points: 5,
            },
          },
        ],
      },
      {
        title: "Label the Parts",
        blocks: [
          {
            blockType: "MATCHING",
            gridWidth: 12,
            config: {
              question: "Match each plant part to its function:",
              pairs: [
                { id: "m-1", left: "Roots", right: "Anchor plant and absorb water" },
                { id: "m-2", left: "Stem", right: "Transports water and nutrients" },
                { id: "m-3", left: "Leaves", right: "Make food through photosynthesis" },
                { id: "m-4", left: "Flowers", right: "Reproduction and seed production" },
              ],
              points: 10,
            },
          },
        ],
      },
    ],
  },
  {
    name: "Grammar Essentials",
    description: "Master the building blocks of English grammar — nouns, verbs, adjectives, and sentence structure.",
    subject: "English",
    grade: 5,
    difficulty: "BEGINNER",
    category: "grammar",
    tags: "nouns, verbs, adjectives, grammar, sentences",
    estimatedMinutes: 25,
    totalPoints: 20,
    isFeatured: false,
    sections: [
      {
        title: "Parts of Speech",
        blocks: [
          {
            blockType: "RICH_TEXT",
            gridWidth: 12,
            config: {
              html: "<h2>Parts of Speech</h2><p>Every word in English belongs to a <strong>part of speech</strong>. The main ones are:</p><table><tbody><tr><th>Part</th><th>Role</th><th>Example</th></tr><tr><td><strong>Noun</strong></td><td>Person, place, or thing</td><td>dog, city, happiness</td></tr><tr><td><strong>Verb</strong></td><td>Action or state</td><td>run, is, think</td></tr><tr><td><strong>Adjective</strong></td><td>Describes a noun</td><td>blue, tall, delicious</td></tr><tr><td><strong>Adverb</strong></td><td>Describes a verb</td><td>quickly, very, well</td></tr></tbody></table>",
            },
          },
        ],
      },
      {
        title: "Identify the Noun",
        blocks: [
          {
            blockType: "RICH_TEXT",
            gridWidth: 6,
            config: {
              html: "<p>Read the sentence and find the <strong>noun</strong>:</p><p style=\"font-size: 18px; font-style: italic;\">\"The <span style=\"color: #2563eb;\">cat</span> sat on the mat.\"</p>",
            },
          },
          {
            blockType: "MULTIPLE_CHOICE",
            gridWidth: 6,
            config: {
              question: "Which word is the noun in: 'The beautiful butterfly flew over the garden'?",
              options: [
                { id: "ge-1", text: "beautiful", isCorrect: false },
                { id: "ge-2", text: "butterfly", isCorrect: true },
                { id: "ge-3", text: "flew", isCorrect: false },
                { id: "ge-4", text: "over", isCorrect: false },
              ],
              randomize: false,
              points: 5,
            },
          },
        ],
      },
      {
        title: "Complete the Sentence",
        blocks: [
          {
            blockType: "FILL_BLANK",
            gridWidth: 12,
            config: {
              question: "Fill in the blanks with the correct words:",
              blanks: [
                { id: "fb-1", text: "The ___ shines brightly in the sky.", answer: "sun", placeholder: "___" },
                { id: "fb-2", text: "She ___ to school every day.", answer: "walks", placeholder: "___" },
                { id: "fb-3", text: "The ___ are playing in the park.", answer: "children", placeholder: "___" },
              ],
              points: 10,
            },
          },
        ],
      },
    ],
  },
  {
    name: "Multiplication Mastery",
    description: "Master multi-digit multiplication, word problems, and mental math strategies for grades 5-6.",
    subject: "Mathematics",
    grade: 6,
    difficulty: "INTERMEDIATE",
    category: "arithmetic",
    tags: "multiplication, times tables, word problems, mental math",
    estimatedMinutes: 40,
    totalPoints: 35,
    isFeatured: true,
    sections: [
      {
        title: "Multi-Digit Multiplication",
        blocks: [
          {
            blockType: "RICH_TEXT",
            gridWidth: 12,
            config: {
              html: "<h2><span style=\"color: #7c3aed;\">Multi-Digit Multiplication</span></h2><p>When multiplying larger numbers, we use the <strong>column method</strong>:</p><pre><code>  24\n× 13\n----\n  72  (24 × 3)\n 240  (24 × 10)\n----\n 312</code></pre><p>Steps:</p><ol><li>Multiply by the ones digit</li><li>Multiply by the tens digit (add a zero)</li><li>Add the results together</li></ol>",
            },
          },
          {
            blockType: "VIDEO",
            gridWidth: 12,
            config: {
              embedUrl: "https://www.youtube.com/embed/dPkZJjxj4Dk",
              title: "How to Multiply Multi-Digit Numbers",
              startTime: 0,
              autoplay: false,
            },
          },
        ],
      },
      {
        title: "Word Problems",
        blocks: [
          {
            blockType: "RICH_TEXT",
            gridWidth: 6,
            config: {
              html: "<p style=\"font-size: 16px;\">A school has <strong>24 classrooms</strong>. Each classroom has <strong>32 desks</strong>. How many desks are there in total?</p><p><em>Hint: Multiply 24 × 32 using the column method.</em></p>",
            },
          },
          {
            blockType: "MULTIPLE_CHOICE",
            gridWidth: 6,
            config: {
              question: "What is the total number of desks?",
              options: [
                { id: "mm-1", text: "648", isCorrect: false },
                { id: "mm-2", text: "768", isCorrect: true },
                { id: "mm-3", text: "736", isCorrect: false },
                { id: "mm-4", text: "824", isCorrect: false },
              ],
              randomize: false,
              points: 10,
            },
          },
          {
            blockType: "RICH_TEXT",
            gridWidth: 12,
            config: {
              html: "<h3>Challenge Problem</h3><p>A library has <strong>156 shelves</strong>. Each shelf holds <strong>45 books</strong>. How many books can the library hold?</p>",
            },
          },
        ],
      },
      {
        title: "Mental Math Game",
        blocks: [
          {
            blockType: "ORDERING",
            gridWidth: 12,
            config: {
              question: "Arrange these products from smallest to largest:",
              items: [
                { id: "mm-o1", text: "15 × 8", correctOrder: 0 },
                { id: "mm-o2", text: "12 × 12", correctOrder: 2 },
                { id: "mm-o3", text: "25 × 4", correctOrder: 1 },
                { id: "mm-o4", text: "20 × 10", correctOrder: 3 },
              ],
              points: 10,
            },
          },
          {
            blockType: "TRUE_FALSE",
            gridWidth: 12,
            config: {
              question: "True or False: 36 × 25 = 900",
              options: [
                { id: "mm-tf1", text: "True", isCorrect: true },
                { id: "mm-tf2", text: "False", isCorrect: false },
              ],
              points: 5,
            },
          },
        ],
      },
    ],
  },
  {
    name: "Solar System Explorer",
    description: "Journey through our solar system — learn about planets, orbits, and space exploration.",
    subject: "Science",
    grade: 6,
    difficulty: "INTERMEDIATE",
    category: "astronomy",
    tags: "planets, solar system, space, orbits, sun",
    estimatedMinutes: 45,
    totalPoints: 40,
    isFeatured: true,
    sections: [
      {
        title: "Our Solar System",
        blocks: [
          {
            blockType: "RICH_TEXT",
            gridWidth: 12,
            config: {
              html: "<h2><span style=\"color: #0891b2;\">The Solar System</span></h2><p>Our solar system consists of the <strong>Sun</strong> at the center, with <strong>8 planets</strong> orbiting around it. The planets in order from the Sun are:</p><ol><li><strong>Mercury</strong> — smallest, closest to the Sun</li><li><strong>Venus</strong> — hottest planet</li><li><strong>Earth</strong> — our home, the only known planet with life</li><li><strong>Mars</strong> — the red planet</li><li><strong>Jupiter</strong> — largest planet</li><li><strong>Saturn</strong> — known for its beautiful rings</li><li><strong>Uranus</strong> — rotates on its side</li><li><strong>Neptune</strong> — farthest, coldest planet</li></ol>",
            },
          },
          {
            blockType: "VIDEO",
            gridWidth: 12,
            config: {
              embedUrl: "https://www.youtube.com/embed/libKVRa01L8",
              title: "Solar System 101",
              startTime: 0,
              autoplay: false,
            },
          },
        ],
      },
      {
        title: "Planet Facts",
        blocks: [
          {
            blockType: "MATCHING",
            gridWidth: 12,
            config: {
              question: "Match each planet to its unique feature:",
              pairs: [
                { id: "ss-m1", left: "Mars", right: "Called the Red Planet" },
                { id: "ss-m2", left: "Saturn", right: "Has spectacular rings" },
                { id: "ss-m3", left: "Jupiter", right: "Largest planet" },
                { id: "ss-m4", left: "Mercury", right: "Smallest planet" },
                { id: "ss-m5", left: "Venus", right: "Hottest planet" },
              ],
              points: 15,
            },
          },
          {
            blockType: "MULTIPLE_CHOICE",
            gridWidth: 12,
            config: {
              question: "Which planet is known as Earth's twin due to similar size?",
              options: [
                { id: "ss-c1", text: "Mars", isCorrect: false },
                { id: "ss-c2", text: "Venus", isCorrect: true, feedback: "Yes! Venus is similar in size and mass to Earth." },
                { id: "ss-c3", text: "Mercury", isCorrect: false },
                { id: "ss-c4", text: "Neptune", isCorrect: false },
              ],
              randomize: false,
              points: 5,
            },
          },
        ],
      },
      {
        title: "Creative Activity",
        blocks: [
          {
            blockType: "RICH_TEXT",
            gridWidth: 12,
            config: {
              html: "<h3>Design Your Own Planet</h3><p>Draw and describe an imaginary planet! Include:</p><ul><li>Its name and size</li><li>Color and appearance</li><li>Distance from the Sun</li><li>Any special features (rings, moons, etc.)</li></ul>",
            },
          },
          {
            blockType: "DRAWING",
            gridWidth: 12,
            config: {
              instruction: "Draw your imaginary planet below:",
              penColor: "#2563eb",
              penWidth: 3,
              points: 10,
            },
          },
        ],
      },
    ],
  },
  {
    name: "Essay Writing Workshop",
    description: "Learn the structure of a great essay — from thesis statements to conclusions with real examples.",
    subject: "English",
    grade: 6,
    difficulty: "ADVANCED",
    category: "writing",
    tags: "essays, writing, thesis, paragraphs, structure",
    estimatedMinutes: 50,
    totalPoints: 30,
    isFeatured: false,
    sections: [
      {
        title: "Essay Structure",
        blocks: [
          {
            blockType: "RICH_TEXT",
            gridWidth: 12,
            config: {
              html: "<h2><span style=\"color: #dc2626;\">How to Write an Essay</span></h2><p>Every strong essay has <strong>three main parts</strong>:</p><ol><li><strong>Introduction</strong> — Hook the reader, state your thesis</li><li><strong>Body</strong> — 3-5 paragraphs with evidence and examples</li><li><strong>Conclusion</strong> — Summarize and leave a lasting impression</li></ol><blockquote><p><em>A good essay is like a well-built house — it needs a strong foundation, solid walls, and a roof that ties everything together.</em></p></blockquote>",
            },
          },
        ],
      },
      {
        title: "Thesis Statements",
        blocks: [
          {
            blockType: "RICH_TEXT",
            gridWidth: 6,
            config: {
              html: "<h3>Strong Thesis Examples</h3><p>A thesis statement is the <strong>main argument</strong> of your essay.</p><p>✅ <span style=\"color: #16a34a;\">\"School uniforms should be mandatory because they promote equality and reduce bullying.\"</span></p><p>❌ <span style=\"color: #dc2626;\">\"School uniforms are good.\"</span></p><p><em>A strong thesis is specific and arguable!</em></p>",
            },
          },
          {
            blockType: "TRUE_FALSE",
            gridWidth: 6,
            config: {
              question: "Which of these is a strong thesis statement?",
              options: [
                { id: "ew-tf1", text: "\"Recycling is important for saving the environment and reducing waste in landfills.\"", isCorrect: true },
                { id: "ew-tf2", text: "\"Recycling is good.\"", isCorrect: false },
              ],
              points: 5,
            },
          },
        ],
      },
      {
        title: "Writing Practice",
        blocks: [
          {
            blockType: "MULTIPLE_CHOICE",
            gridWidth: 12,
            config: {
              question: "What should your conclusion paragraph include?",
              options: [
                { id: "ew-c1", text: "A brand new argument you haven't mentioned", isCorrect: false },
                { id: "ew-c2", text: "A restated thesis and summary of main points", isCorrect: true },
                { id: "ew-c3", text: "The same sentence as your introduction", isCorrect: false },
              ],
              randomize: false,
              points: 5,
            },
          },
          {
            blockType: "HOMEWORK_UPLOAD",
            gridWidth: 12,
            config: {
              instruction: "Write a 3-paragraph essay on: 'Should students have homework on weekends?' Upload your essay as a PDF.",
              points: 20,
            },
          },
        ],
      },
    ],
  },
  {
    name: "Kata Nama",
    description: "Kenali kata nama am dan kata nama khas dalam Bahasa Melayu dengan contoh dan latihan interaktif.",
    subject: "Bahasa Melayu",
    grade: 5,
    difficulty: "BEGINNER",
    category: "grammar",
    tags: "kata nama, bahasa melayu, tatabahasa, am, khas",
    estimatedMinutes: 25,
    totalPoints: 20,
    isFeatured: false,
    sections: [
      {
        title: "Apa Itu Kata Nama?",
        blocks: [
          {
            blockType: "RICH_TEXT",
            gridWidth: 12,
            config: {
              html: "<h2><span style=\"color: #7c3aed;\">Kata Nama</span></h2><p><strong>Kata nama</strong> ialah perkataan yang merujuk kepada <strong>nama orang, haiwan, benda, tempat, atau konsep</strong>.</p><p>Terdapat dua jenis kata nama:</p><ul><li><strong>Kata Nama Am</strong> — nama umum (contoh: <em>meja, guru, kucing, bandar</em>)</li><li><strong>Kata Nama Khas</strong> — nama khusus, menggunakan huruf besar (contoh: <em>Ali, Kuala Lumpur, Proton Saga</em>)</li></ul>",
            },
          },
        ],
      },
      {
        title: "Latihan",
        blocks: [
          {
            blockType: "MULTIPLE_CHOICE",
            gridWidth: 6,
            config: {
              question: "\"Kucing\" ialah kata nama ____.",
              options: [
                { id: "kn-c1", text: "Am", isCorrect: true },
                { id: "kn-c2", text: "Khas", isCorrect: false },
                { id: "kn-c3", text: "Ganti", isCorrect: false },
              ],
              randomize: false,
              points: 5,
            },
          },
          {
            blockType: "MULTIPLE_CHOICE",
            gridWidth: 6,
            config: {
              question: "\"Cikgu Ahmad\" ialah kata nama ____.",
              options: [
                { id: "kn-c4", text: "Am", isCorrect: false },
                { id: "kn-c5", text: "Khas", isCorrect: true },
                { id: "kn-c6", text: "Terbitan", isCorrect: false },
              ],
              randomize: false,
              points: 5,
            },
          },
        ],
      },
      {
        title: "Padanan",
        blocks: [
          {
            blockType: "MATCHING",
            gridWidth: 12,
            config: {
              question: "Padankan kata nama dengan jenisnya:",
              pairs: [
                { id: "kn-m1", left: "Doktor", right: "Kata Nama Am" },
                { id: "kn-m2", left: "Malaysia", right: "Kata Nama Khas" },
                { id: "kn-m3", left: "Buku", right: "Kata Nama Am" },
                { id: "kn-m4", left: "Gunung Kinabalu", right: "Kata Nama Khas" },
              ],
              points: 10,
            },
          },
        ],
      },
    ],
  },
  {
    name: "Ecosystems & Food Chains",
    description: "Discover how living things depend on each other through food chains, food webs, and ecosystems.",
    subject: "Science",
    grade: 6,
    difficulty: "ADVANCED",
    category: "biology",
    tags: "ecosystems, food chains, producers, consumers, decomposers",
    estimatedMinutes: 40,
    totalPoints: 30,
    isFeatured: true,
    sections: [
      {
        title: "What is an Ecosystem?",
        blocks: [
          {
            blockType: "RICH_TEXT",
            gridWidth: 8,
            config: {
              html: "<h2><span style=\"color: #65a30d;\">Ecosystems & Food Chains</span></h2><p>An <strong>ecosystem</strong> is a community of living organisms interacting with their environment. Every organism has a role:</p><ul><li><strong>Producers</strong> — make their own food (plants, algae)</li><li><strong>Consumers</strong> — eat other organisms</li><ul><li>Primary — eat producers (rabbits, cows)</li><li>Secondary — eat primary consumers (foxes)</li><li>Tertiary — top predators (eagles, sharks)</li></ul><li><strong>Decomposers</strong> — break down dead matter (fungi, bacteria)</li></ul>",
            },
          },
          {
            blockType: "IMAGE",
            gridWidth: 4,
            config: {
              fileId: "/placeholder-foodchain.svg",
              altText: "A food chain showing grass → rabbit → fox → decomposer",
            },
          },
        ],
      },
      {
        title: "Build a Food Chain",
        blocks: [
          {
            blockType: "ORDERING",
            gridWidth: 12,
            config: {
              question: "Arrange these organisms to form a correct food chain (producer first):",
              items: [
                { id: "ec-o1", text: "🌿 Grass (Producer)", correctOrder: 0 },
                { id: "ec-o2", text: "🐛 Caterpillar", correctOrder: 1 },
                { id: "ec-o3", text: "🐦 Bird", correctOrder: 2 },
                { id: "ec-o4", text: "🦅 Eagle", correctOrder: 3 },
              ],
              points: 10,
            },
          },
          {
            blockType: "MULTIPLE_CHOICE",
            gridWidth: 12,
            config: {
              question: "What would happen if ALL the rabbits were removed from a forest ecosystem?",
              options: [
                { id: "ec-c1", text: "Foxes would have less food and their population may decrease", isCorrect: true },
                { id: "ec-c2", text: "The grass would disappear", isCorrect: false },
                { id: "ec-c3", text: "Nothing would change", isCorrect: false },
                { id: "ec-c4", text: "Eagles would start eating grass", isCorrect: false },
              ],
              randomize: false,
              points: 10,
            },
          },
        ],
      },
      {
        title: "Creative Task",
        blocks: [
          {
            blockType: "DRAWING",
            gridWidth: 12,
            config: {
              instruction: "Draw your own food web with at least 6 organisms. Include producers, consumers, and decomposers.",
              penColor: "#000000",
              penWidth: 3,
              points: 10,
            },
          },
        ],
      },
    ],
  },
  {
    name: "Geometry Shapes",
    description: "Explore 2D and 3D shapes, angles, symmetry, and perimeter with hands-on activities.",
    subject: "Mathematics",
    grade: 5,
    difficulty: "INTERMEDIATE",
    category: "geometry",
    tags: "shapes, angles, symmetry, perimeter, geometry",
    estimatedMinutes: 35,
    totalPoints: 25,
    isFeatured: false,
    sections: [
      {
        title: "2D Shapes",
        blocks: [
          {
            blockType: "RICH_TEXT",
            gridWidth: 12,
            config: {
              html: "<h2><span style=\"color: #d97706;\">2D Shapes</span></h2><p>Two-dimensional shapes have <strong>length and width</strong> but no depth. Key shapes include:</p><table><tbody><tr><th>Shape</th><th>Sides</th><th>Angles</th><th>Properties</th></tr><tr><td>Triangle</td><td>3</td><td>3 (sum = 180°)</td><td>Can be equilateral, isosceles, or scalene</td></tr><tr><td>Square</td><td>4</td><td>4 (90° each)</td><td>All sides equal</td></tr><tr><td>Rectangle</td><td>4</td><td>4 (90° each)</td><td>Opposite sides equal</td></tr><tr><td>Pentagon</td><td>5</td><td>5</td><td>Interior sum = 540°</td></tr></tbody></table>",
            },
          },
          {
            blockType: "MULTIPLE_CHOICE",
            gridWidth: 6,
            config: {
              question: "How many sides does a hexagon have?",
              options: [
                { id: "gs-c1", text: "4", isCorrect: false },
                { id: "gs-c2", text: "5", isCorrect: false },
                { id: "gs-c3", text: "6", isCorrect: true },
                { id: "gs-c4", text: "8", isCorrect: false },
              ],
              randomize: false,
              points: 5,
            },
          },
          {
            blockType: "TRUE_FALSE",
            gridWidth: 6,
            config: {
              question: "A square is a type of rectangle.",
              options: [
                { id: "gs-tf1", text: "True", isCorrect: true },
                { id: "gs-tf2", text: "False", isCorrect: false },
              ],
              points: 5,
            },
          },
        ],
      },
      {
        title: "Perimeter Fun",
        blocks: [
          {
            blockType: "RICH_TEXT",
            gridWidth: 6,
            config: {
              html: "<h3>Calculating Perimeter</h3><p><strong>Perimeter</strong> is the distance around a shape.</p><p>Rectangle formula: <code>P = 2 × (length + width)</code></p><p>Square formula: <code>P = 4 × side</code></p><p style=\"background: #fef3c7; padding: 8px; border-radius: 4px;\"><strong>Try this:</strong> A rectangle has length 8 cm and width 5 cm. What is its perimeter?</p>",
            },
          },
          {
            blockType: "FILL_BLANK",
            gridWidth: 6,
            config: {
              question: "Solve the perimeter problems:",
              blanks: [
                { id: "gs-fb1", text: "A square with side 6 cm has perimeter ___ cm.", answer: "24", placeholder: "___" },
                { id: "gs-fb2", text: "A rectangle 10 cm by 4 cm has perimeter ___ cm.", answer: "28", placeholder: "___" },
                { id: "gs-fb3", text: "An equilateral triangle with side 7 cm has perimeter ___ cm.", answer: "21", placeholder: "___" },
              ],
              points: 10,
            },
          },
        ],
      },
    ],
  },
  {
    name: "Reading Comprehension",
    description: "Build reading skills with interesting passages, vocabulary exercises, and comprehension questions.",
    subject: "English",
    grade: 5,
    difficulty: "INTERMEDIATE",
    category: "reading",
    tags: "reading, comprehension, vocabulary, passages, questions",
    estimatedMinutes: 30,
    totalPoints: 20,
    isFeatured: false,
    sections: [
      {
        title: "Read the Passage",
        blocks: [
          {
            blockType: "RICH_TEXT",
            gridWidth: 12,
            config: {
              html: "<h2>The Lost Kitten</h2><p>Maya found a small orange kitten hiding under a bush near her school. The kitten was shivering and looked hungry. Maya carefully picked it up and wrapped it in her jacket.</p><p>\"Don't worry, little one,\" she whispered. \"I'll find your home.\"</p><p>Maya went to every house on the street asking if anyone had lost a kitten. Finally, at number 42, an elderly woman named Mrs. Chen burst into tears of joy. \"That's Mittens!\" she cried. \"He's been missing since yesterday!\"</p><p>Mrs. Chen thanked Maya with a warm hug and a plate of freshly baked cookies. Maya went home feeling happy that she had helped.</p>",
            },
          },
        ],
      },
      {
        title: "Check Understanding",
        blocks: [
          {
            blockType: "MULTIPLE_CHOICE",
            gridWidth: 6,
            config: {
              question: "Where did Maya find the kitten?",
              options: [
                { id: "rc-c1", text: "In a tree", isCorrect: false },
                { id: "rc-c2", text: "Under a bush", isCorrect: true },
                { id: "rc-c3", text: "In a box", isCorrect: false },
                { id: "rc-c4", text: "At school", isCorrect: false },
              ],
              randomize: false,
              points: 5,
            },
          },
          {
            blockType: "MULTIPLE_CHOICE",
            gridWidth: 6,
            config: {
              question: "What color was the kitten?",
              options: [
                { id: "rc-c5", text: "Black", isCorrect: false },
                { id: "rc-c6", text: "White", isCorrect: false },
                { id: "rc-c7", text: "Orange", isCorrect: true },
                { id: "rc-c8", text: "Grey", isCorrect: false },
              ],
              randomize: false,
              points: 5,
            },
          },
        ],
      },
      {
        title: "Vocabulary",
        blocks: [
          {
            blockType: "MATCHING",
            gridWidth: 12,
            config: {
              question: "Match each word to its meaning:",
              pairs: [
                { id: "rc-m1", left: "shivering", right: "Trembling from cold or fear" },
                { id: "rc-m2", left: "elderly", right: "Old or advanced in age" },
                { id: "rc-m3", left: "burst into tears", right: "Suddenly started crying" },
                { id: "rc-m4", left: "grateful", right: "Feeling thankful" },
              ],
              points: 10,
            },
          },
        ],
      },
    ],
  },
]

async function main() {
  console.log("Seeding database...")

  const teacherPassword = await bcrypt.hash("teacher123", 12)
  const studentPassword = await bcrypt.hash("student123", 12)

  const teacher = await prisma.user.upsert({
    where: { email: "teacher@demo.com" },
    update: {},
    create: {
      name: "Demo Teacher",
      email: "teacher@demo.com",
      password: teacherPassword,
      role: "TEACHER",
    },
  })

  const student = await prisma.user.upsert({
    where: { email: "student@demo.com" },
    update: {},
    create: {
      name: "Demo Student",
      email: "student@demo.com",
      password: studentPassword,
      role: "STUDENT",
    },
  })

  const subjects = [
    { name: "Mathematics", grade: 5 },
    { name: "Science", grade: 5 },
    { name: "English", grade: 5 },
    { name: "Bahasa Melayu", grade: 5 },
    { name: "Mathematics", grade: 6 },
    { name: "Science", grade: 6 },
    { name: "English", grade: 6 },
    { name: "Bahasa Melayu", grade: 6 },
    { name: "Mathematics", grade: 7 },
    { name: "Science", grade: 7 },
    { name: "English", grade: 7 },
  ]

  for (const subj of subjects) {
    await prisma.subject.upsert({
      where: {
        teacherId_name_grade: {
          teacherId: teacher.id,
          name: subj.name,
          grade: subj.grade,
        },
      },
      update: {},
      create: {
        name: subj.name,
        grade: subj.grade,
        teacherId: teacher.id,
      },
    })
  }

  console.log("Seeding global templates...")
  for (const tpl of TEMPLATES) {
    const existing = await prisma.globalTemplate.findFirst({
      where: { name: tpl.name },
    })
    if (!existing) {
      const created = await prisma.globalTemplate.create({
        data: {
          name: tpl.name,
          description: tpl.description,
          subject: tpl.subject,
          grade: tpl.grade,
          difficulty: tpl.difficulty,
          category: tpl.category,
          tags: tpl.tags,
          estimatedMinutes: tpl.estimatedMinutes,
          totalPoints: tpl.totalPoints,
          isFeatured: tpl.isFeatured,
          sections: {
            create: tpl.sections.map((sec, si) => ({
              title: sec.title,
              orderIndex: si,
              blocks: {
                create: sec.blocks.map((blk: any, bi) => ({
                  blockType: blk.blockType,
                  gridColumn: blk.gridColumn ?? 1,
                  gridWidth: blk.gridWidth ?? 12,
                  config: JSON.stringify(blk.config),
                })),
              },
            })),
          },
        },
      })
      console.log(`  Created template: ${created.name}`)
    } else {
      console.log(`  Skipped (exists): ${existing.name}`)
    }
  }

  console.log("Seeded: teacher@demo.com / teacher123")
  console.log("Seeded: student@demo.com / student123")
  console.log("Seed complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
