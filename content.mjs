// All site copy and media lives here. `node build.mjs` turns it into static pages in dist/.
// Rich text fields are HTML strings.

export const site = {
  name: 'Niels van Egmond',
  url: 'https://www.nielsvanegmond.nl',
  description: 'Portfolio of Niels van Egmond: Technical Designer, Game Developer & Designer.',
  linkedin: 'https://www.linkedin.com/in/nielsvanegmond/',
  cv: '/assets/docs/Niels-van-Egmond-Technical-Designer-CV.pdf',
  reel: { youtube: 'MicJmzQi08M' },
};

export const home = {
  hero: {
    facts: [
      'Professional experience across <strong>Tech</strong>, <strong>Design</strong> &amp; <strong>Art</strong>',
      '<strong>18+</strong> years at <strong>Paladin Studios</strong>',
      'Based in the <strong>Netherlands</strong>',
    ],
    tagline: 'WD40 for GameDev',
  },
  about: {
    lead: 'From concept to controller, I turn ideas into games that feel right.',
    body: 'Whether I’m building mechanics, prototyping systems, or shaping core gameplay, I work at the intersection of design, tech, and art. Bringing ideas to life and connecting the people needed to make the games shine.',
  },
  testimonials: [
    {
      name: 'Coen Neessen',
      role: 'Game Director',
      projects: ['Good Job!', 'Cut the Rope Remastered', 'Prototypes', 'Cut the Rope 3', 'Stickers'],
      quote: `<p class="lead">Niels is one of the best game developers I have had the pleasure to work with in my career.</p>
<p>He has a great eye and intuition for fun, a deep understanding of the creative process, and combines this with a very practical skill and mindset.</p>
<p>He rapidly creates both inspiring prototypes and polished features</p>
<p>He’s highly critical of usability and controls, always looking to improve and push the quality further <strong>making the games that much more enjoyable to play and experience.</strong></p>`,
    },
    {
      name: 'Chris Nengerman',
      role: 'Game Director',
      projects: ['Nailed It!', 'Stormbound', 'Super Car City', 'Prototypes'],
      quote: `<p class="lead">Niels is an exceptional technical designer.</p>
<p>He has mastered early prototyping and refining game feel. With his technical background, Niels can tackle technical challenges like no other, while keeping the design goals of a project in focus.</p>
<p>As a technical designer, Niels has often been the bridge between tech and design, contributing significantly to multidisciplinary alignment.</p>
<p><strong>Niels is a world-class creative thinker</strong>, always looking to improve creative processes to achieve the highest quality results.</p>`,
    },
    {
      name: 'Rombout Casander',
      role: 'Game Director',
      projects: ['Multiple Prototypes'],
      quote: `<p class="lead">I highly recommend Niels as a senior Technical Designer.</p>
<p>With extensive experience in numerous complex game projects, Niels has consistently proven himself as an invaluable team asset.</p>
<p>His ability to devise creative solutions to tough problems is unparalleled. Niels’ insights and innovations consistently exceed expectations.</p>
<p>Moreover, his relaxed, easygoing nature and great sense of humor make him a pleasure to work with.</p>
<p><strong>Engaging Niels for any project is a decision you won’t regret.</strong></p>`,
    },
  ],
};

export const about = {
  slug: 'about-me',
  title: 'About Me',
  intro: `<p>A highly experienced Technical Game Designer with a passion for crafting engaging, immersive player experiences. Specializing in prototyping, mechanics, gameplay, controls, game feel, and physics, I focus on creating fluid, responsive, and satisfying interactions that resonate with players.</p>
<p>With 19+ years in game development, I have worked across programming, art, design, and leadership, allowing me to bridge disciplines and improve communication between teams. This broad expertise enables me to tackle complex, cross-disciplinary features, ensuring seamless integration of mechanics, tools, and processes while driving innovation.</p>
<p>I’ve contributed to over 10 different genres, and I enjoy adapting to new ones. That variety keeps me sharp and helps me bring fresh ideas to any project. Whatever the genre, I aim to make every interaction polished, immersive, and technically robust.</p>`,
  expertise: [
    ['Prototyping &amp; Iteration', 'Rapidly developing and refining gameplay mechanics for fun, functional designs.'],
    ['Gameplay &amp; Controls', 'Fine-tuning movement, input responsiveness, physics, and camera behavior for an intuitive experience.'],
    ['Physics-Based Gameplay', 'Pushing physics engines to their limits and extending them when needed for maximum stability, precision, and responsiveness.'],
    ['Cross-Disciplinary Collaboration', 'Bridging design, programming, and art to align creative vision with technical feasibility.'],
    ['Tools &amp; Pipeline Development', 'Creating custom tools, workflows, and automation scripts to improve efficiency.'],
  ],
  jobs: [
    {
      company: 'Nosy Fish',
      period: 'April 2024 – Present',
      logo: 'nosy-fish-logo.webp',
      body: 'Co-founder of a small indie studio developing a cozy puzzle game. Involved in all aspects of development, from graphic design to system programming. The project is not publicly announced but can be demonstrated in private.',
    },
    {
      company: 'Paladin Studios',
      period: 'Jan 2006 – May 2024',
      logo: 'paladin-logo.webp',
      body: 'Started as part of a three-person team and contributed to its growth into a 50+ person studio. Evolved together with Paladin Studios, progressing through multiple official roles:',
      roles: ['Art Intern', '3D Artist', 'Lead Artist', 'Producer', 'Technical Director', 'Senior Programmer', 'Principal Technical Designer'],
      after: 'The final title best represents my expertise and career focus.',
    },
  ],
};

export const projects = [
  {
    slug: 'good-job',
    title: 'Good Job!',
    tile: 'good-job-tile.webp',
    header: { img: 'good-job-header.webp', youtube: '5c9QZFeVrRY', alt: 'Good Job! key art' },
    body: `<p>At Paladin Studios, we worked closely with Nintendo on this physics-based puzzle sandbox full of creative problem solving and chaos. In <em>Good Job!</em>, you play a clumsy office worker climbing the corporate ladder by completing simple tasks, like plugging in a projector or watering plants. But how you do it is entirely up to you.</p>
<p>Want to carefully wheel the projector into place? Great. Want to slingshot it through a glass wall using an elastic cable? Also great. The game rewards both cleverness and curiosity through playful, emergent systems.</p>
<h3>Contributions</h3>
<p>My exact contributions to <em>Good Job!</em> are under NDA.</p>`,
    facts: [
      ['Studio', 'Paladin Studios'],
      ['Client', 'Nintendo'],
      ['Platform', 'Nintendo Switch'],
      ['Role', 'Senior Programmer'],
    ],
    link: 'https://www.nintendo.com/us/store/products/good-job-switch/',
  },
  {
    slug: 'cut-the-rope-3',
    title: 'Cut the Rope 3',
    tile: 'ctr3-tile.webp',
    header: { img: 'ctr3-header.webp', youtube: '1ZzoWFQ_g9k', alt: 'Cut the Rope 3 key art' },
    body: `<p>At Paladin Studios, we had the honour of creating the next installment in ZeptoLab’s beloved <em>Cut the Rope</em> series. As a longtime fan, it was a dream project for me.</p>
<p>In this version, players guide Nibble Nom, Om Nom’s adventurous child, through physics-based puzzles to reunite with his dad. Replacing the classic candy with a living character might seem minor, but it fundamentally changed the gameplay. With Nibble Nom as the payload, the game became more action-driven and expressive.</p>
<p>Even familiar mechanics took on new life. The whip, for example, feels inspired by the original rope-gun, but reimagined as a heroic, Indiana Jones-style swing, it changed both the tone and the gameplay feel entirely.</p>`,
    facts: [
      ['Studio', 'Paladin Studios'],
      ['Clients', 'ZeptoLab<br>Apple Arcade'],
      ['Platforms', 'iPhone, iPad, Apple TV, Mac, Vision Pro'],
      ['Role', 'Principal Technical Designer'],
    ],
    link: 'https://apps.apple.com/nl/app/cut-the-rope-3/id997332884',
    contributions: [
      ['Design', [
        'Introduced a structured ideation process to surface high-impact ideas',
        'Designed core gameplay mechanics',
        'Adapted controls for Apple TV and Vision Pro',
        'Championed the move from candy to Nibble Nom as the hook',
      ]],
      ['Code', [
        'Built complex, physics-based mechanics with strong gamefeel',
        'Supported and guided gameplay programmers across key features',
      ]],
      ['Tools', [
        'Developed in-game animation systems',
        'Created a custom 3D layering workflow for visual depth and clarity',
      ]],
      ['Leadership', ['Led the design and development of the Vision Pro version']],
    ],
    gallery: { img: 'ctr3-screenshot.webp', alt: 'Cut the Rope 3 gameplay screenshot' },
  },
];

// Example media: `img` is the thumbnail; `youtube` opens a video, otherwise the image opens full size.
// `vertical` marks YouTube Shorts so the player uses a portrait frame.
export const skills = [
  {
    slug: 'design',
    title: 'Design',
    tile: 'lightbulb.webp',
    intro: `<p>At my core, I’m a game designer and I’ll learn whatever I need to bring an idea to life. I’ve designed across every layer of a game: meta systems, UI/UX, tools, code, but my favorite space is core gameplay design, especially where design, tech, and art meet. That includes prototyping, physics systems, 3C’s, and gamefeel. It’s where I shine.</p>
<p>I’ve worked across more than ten genres, from shmups to puzzle platformers, card games to physics puzzlers, pinball to stealth-action. I have rarely repeated a genre, and that range has taught me how to adapt fast, find what matters, and bring fresh perspective to any system or mechanic.</p>
<p>I care deeply about team creativity. I want to create environments where the best ideas win, not just mine. If I see a process slowing down iteration or muddying direction, I speak up and help shape something better. I love chasing great ideas, but I care even more about helping the team find <em>the</em> idea that really clicks.</p>`,
    introImg: { img: 'lightbulb.webp', alt: 'Illustration of a lightbulb' },
    introFit: 'square', introBeside: 1, mediaFirstLeft: true,
    sections: [{
      heading: ['Key', 'Examples'],
      examples: [
        {
          title: 'Cut the Rope 3 | Core Hook',
          body: '<p>Came up with the key idea that shaped CtR3’s identity: what if Nibble Nom was the candy? This made perfect sense for the next evolution of the Cut the Rope IP. From that point on, everything fell into place.</p>',
          media: { img: 'ctr3-hook.webp', alt: 'Nibble Nom hanging from ropes in Cut the Rope 3' },
        },
        {
          title: 'Paladin | Ideation Process',
          body: `<p>Spearheaded a successful, company-wide ideation habit built on clarity, inclusion, and consistency.</p>
<p>The system centers on two simple components:</p>
<p><strong>An open idea board</strong> - accessible to everyone, encouraging contributions from all departments.</p>
<p><strong>A weekly pitch session</strong> - where ideas are shared, excitement is felt, and feedback is constructive.</p>`,
          // Runs full width below the image, as on the original page.
          after: `<p>There are <strong>no traditional brainstorms</strong>. All ideas are prepared and pitched. Participation is opt-in. Only those in a “yes, and” mindset attend. Every idea gets heard, with thoughtful, appreciative feedback.</p>
<p>Over time, this became our go-to creative engine. Many <strong>core mechanics</strong> and <strong>prototype ideas</strong> emerged from outside the design team, thanks to the open structure. It fostered async ideation, cross-discipline ownership, and consistent creative energy, while also strengthening morale and team cohesion.</p>`,
          media: { img: 'ideation-process.webp', alt: 'Diagram of the ideation process' },
        },
      ],
    }],
  },
  {
    slug: 'prototype',
    title: 'Prototype',
    tile: 'ctr3-prototyping.webp',
    introImg: { img: 'prototype-level.webp', alt: 'Cut the Rope prototype level' },
    introFit: 'stretch', mediaFirstLeft: true,
    intro: `<p>Prototyping is how I think, how I communicate, and how I solve problems. Where an artist sketches, I build interactions. You can debate ideas for hours, but you won’t know if they’re fun until you play them. A rough build says more than any document ever could.</p>
<p>I draw a clear line between prototyping and production. It’s tempting to polish something until it almost works, but “almost” isn’t good enough. I’m quick to cut ideas that fall flat in play. If it’s not fun early, production polish won’t fix it. I’d rather kill a darling than waste time dressing it up. But sometimes, the best ideas return sharper and stronger when the missing piece finally falls into place.</p>`,
    sections: [{
      heading: ['Key', 'Examples'],
      examples: [
        {
          title: 'Cut the Rope 3 | Prototyping',
          body: '<p>I laid down the ground rules for our prototyping phase and led the latest refinement of our team’s prototyping process. We kept the prototype deliberately 2D and visually simple to reduce friction and maximize iteration speed. This disciplined approach helped us focus on core mechanics and steer the direction of the final game with minimal waste.</p>',
          media: { img: 'ctr3-prototyping.webp', youtube: '7vMjDLCBXRE', alt: 'Cut the Rope 3 prototype' },
        },
        {
          title: 'Atlantic Sky | Personal Prototype',
          body: `<p>A spare-time prototype built with minimal code and complexity, yet already fun to play. Despite being unfinished, it demonstrates strong potential and captures a compelling core loop.</p>
<p>I wanted to capture the feeling of sailing at sea and building your ship while you’re underway, but in the air instead.</p>`,
          media: { img: 'atlantic-sky.webp', youtube: 'eHpMGiGqGDU', alt: 'Atlantic Sky prototype: an airship in the clouds' },
        },
      ],
    }],
  },
  {
    slug: 'code',
    title: 'Code',
    tile: 'code.webp',
    intro: `<p>Code is my most used tool for creative expression. I’ve worked in Unity with C# for over 16 years, building everything from quick scripts to performance critical systems.</p>
<p>My core work is technical design, and for that, I rely on a fertile, adaptable codebase. I care deeply about code quality, not as an aesthetic pursuit, but because it directly affects how quickly and clearly ideas can grow. I contribute to architecture, structure, and standards when needed. Especially where it helps keep development flexible and expressive.</p>
<p>Having shipped many mobile titles, I’m tuned into performance, memory, and the reality of hardware constraints. My experience with optimization informs how I design and how I support other designers in making performance conscious decisions.</p>`,
    introImg: { img: 'code.webp', alt: 'Illustration of code' },
    introFit: 'stretch',
    sections: [{
      heading: ['Key', 'Accomplishments'],
      examples: [
        {
          title: 'Self Taught Programmer',
          body: '<p>Taught myself how to code, fueled by curiosity, persistence, and the support of generous colleagues. That foundation shaped the practical, design driven approach I still use today.</p>',
        },
        {
          title: 'Technical Director',
          body: '<p>Grew into the role of Technical Director, shaping team practices and technical direction that remained in place long after I stepped away. I’m proud not just of reaching that point, but of recognizing when it wasn’t the right fit and returning to where I do my best work.</p>',
        },
      ],
    }],
  },
  {
    slug: 'tools',
    title: 'Tools',
    tile: 'animator-actions.webp',
    intro: `<p>I’ve built a wide range of tools in Unity, supporting designers, developers, and content creators. I’m comfortable with IMGUI and have recently started working with UI Toolkit. What makes me especially effective as a tool builder is that I use similar tools myself. I draw on my experience across design, tech, and art to create solutions that feel intuitive, solve real problems, and improve workflows.</p>
<p>Many of my tools evolve over multiple projects. I often start with a quick, functional version, and refine it over time adding structure, polish, and flexibility based on real-world use. That way, successful tools don’t just solve one problem. They scale across teams and projects.</p>`,
    sections: [{
      heading: ['Key', 'Examples'],
      examples: [
        {
          title: 'Animator Actions',
          body: '<p>Lets designers trigger effects or code at the enter, exit, or a specific time within an animation state, without writing custom logic. This tool removed the need for tech support on small tasks, letting designers work faster and more independently.</p>',
          media: { img: 'animator-actions.webp', youtube: 'YbrPmOsWM54', alt: 'Animator Actions tool in the Unity inspector' },
        },
        {
          title: 'State Machine Graph Editor',
          body: '<p>A visual graph editor for the Paladin state machine, built using UI Toolkit and GraphView. It generates scripts from the graph’s data and displays the current state during play mode. Designed to be robust and flexible, it’s ready for use across our application flow and beyond.</p>',
          media: { img: 'state-machine-graph.webp', youtube: 'I3cSRU9_J5s', alt: 'State machine graph editor' },
        },
        {
          title: 'Routine Utility',
          body: '<p>A utility expanding Unity’s coroutine system. Start routines from any object, nest routines, and many more useful extensions. This tool was used for more than 10 years.</p>',
          media: { img: 'routine-code.webp', alt: 'Code sample using the Routine utility' },
        },
      ],
    }],
  },
  {
    slug: 'physics',
    title: 'Physics',
    tile: 'ctr3-pull-rope.webp',
    intro: `<p>I’ve worked with physics for over 18 years, across four different engines, in both 2D and 3D. Many of the games I’ve shipped rely on physics gameplay, and over time I’ve developed a strong feel for building simulations that are both stable and performant.</p>
<p>I see physics as dynamic animation. It lives on a spectrum, from arcade-like responsiveness to full simulation. I’m good at picking the right spot for a feature and shaping the behavior accordingly. I often ask myself: should this be solved with physics, animation, or a mix of both? I blend both tools to get the experience I want to reach.</p>
<p>I enjoy using everything a physics engine has to offer, but I’m just as comfortable going beyond it, building custom joints, ropes, or collision behavior when the built-in tools don’t quite fit.</p>`,
    sections: [{
      heading: ['Key', 'Examples'],
      examples: [
        {
          title: 'CtR 3 | Custom Pull Rope Joint',
          body: '<p>Box2D didn’t support the joint type I needed for a rope-pulling mechanic, so I built my own. It gave me full control, especially when the character was connected to a moving body. I went for an arcadey response over realism, matching what the player expects rather than what would physically happen.</p>',
          media: { img: 'ctr3-pull-rope.webp', youtube: '7bZJ2uM4Naw', vertical: true, alt: 'Pull rope mechanic in Cut the Rope 3' },
        },
        {
          title: 'Momonga | Custom Flipper Collision',
          body: '<p>The physics engine didn’t handle collisions between the ball and rotating flipper correctly. I replaced it with manual calculations, choosing an arcadey response over realism to give the player more control and fit the tone of the game.</p>',
          media: { img: 'momonga.webp', alt: 'Momonga Pinball Adventures screenshot' },
        },
      ],
    }],
  },
  {
    slug: '3cs',
    title: '3C’s',
    tile: 'controllers.webp',
    intro: '<p><strong>Character Camera Controls -</strong> I’m always studying how the 3C’s evolve. Two of the most memorable games I played around the same time were <em>Tomb Raider II</em> and <em>Super Mario 64</em>. I was fascinated by how much the addition of the analog stick and camera control changed what was possible. From tank controls to the foundation of the 3C systems we still use today.</p>',
    introImg: { img: 'controllers.webp', alt: 'Illustration of game controllers' },
    introFit: 'large',
    sections: [
      {
        heading: ['Character'],
        intro: `<p>I’ve worked on many character controllers over the years both in production and prototyping. Most of my shipped games featured physics-driven characters: pinballs, golf balls, or rolling circles like Nibble Nom in <em>Cut the Rope</em>. These characters don’t move by player input, things happen to them through the environment. The challenge is giving them a sense of agency, as if they’re reacting with intent, even though they have no real control.</p>
<p>In parallel, I’ve built a variety of direct-control character controllers in prototypes, both 2D and 3D. I focus on acceleration, air control, jump behavior, and responsiveness. Coyote time, input buffering, late jump windows: those invisible systems are what make a character feel right to play.</p>`,
        examples: [{
          title: 'Atlantic Sky - Character Controller',
          body: '<p>In this prototype, I built a third-person controller that stays grounded and responsive while walking on a constantly moving airship. The goal was to keep player movement stable, readable, and consistent—even with physics and platform motion in play.</p>',
          media: { img: 'atlantic-sky.webp', youtube: 'eHpMGiGqGDU', alt: 'Atlantic Sky prototype: an airship in the clouds' },
        }],
      },
      {
        heading: ['Camera'],
        intro: `<p>I’ve worked on all kinds of camera setups: top-down, follow cams, cutscenes, couch co-op, stereoscopic and more. Each with its own challenges. I’m meticulous about how cameras move and want full control over their behavior. I use diagnostic tools to catch subtle stutters or quirks that can break the feel. Camera issues are often hard to see, but easy to feel.</p>
<p>Good camera work should go unnoticed. Every movement needs a reason, whether it’s input, an event, or to show something important. Anything else is noise.</p>`,
        examples: [{
          title: 'Camera Blending System',
          body: '<p>Built a flexible camera blending system, distilled from everything I found myself rebuilding in camera systems over the years. It handles clean transitions between setups, with support for tweens and Timeline. It’s very flexible so you can build any custom camera rig on top.</p>',
        }],
      },
      {
        heading: ['Controls'],
        intro: `<p>I’ve worked on a wide range of control schemes: touch, controllers, virtual joysticks, remotes, even gaze and hand tracking on Vision Pro. Each input method shapes what kinds of games feel right, and I love exploring that. One of my favorite challenges is adapting a game to a different input device: figuring out what breaks, what changes, and how to make it feel intuitive again.</p>
<p>I’ll do whatever it takes to reduce friction, tuning curves, hunting down latency, shaving off hidden delays. That last frame of input lag? I’m looking for it.</p>`,
        examples: [{
          title: 'Cut the Rope 3 – Vision Pro Controls',
          body: '<p>The challenge was to adapt a touch-based game to Vision Pro’s gaze-and-snap interface, with no existing examples and limited API support at the time. As a launch title, we were figuring it out as we built it. Despite the constraints, the result felt intuitive and played surprisingly well.</p>',
          media: { img: 'ctr3-vision-pro.webp', youtube: 'FNVroHWUYn4', alt: 'Cut the Rope 3 on Vision Pro' },
        }],
      },
    ],
  },
  {
    slug: 'ui',
    title: 'UI',
    tile: 'ctrr-level-complete.webp',
    introWide: { img: 'stormbound.webp', alt: 'Stormbound match screen', after: 2 },
    mediaFirstLeft: true,
    intro: `<p>I’ve worked extensively on UI design and implementation, and I’ve been obsessed with usability ever since I learned about it in college. I love discovering new interaction patterns, especially from unexpected places in apps and industrial design.</p>
<p>I’ve built full UI systems from scratch, but I’ve also worked closely with artists, designers, animators, and UI programmers to push ideas further than I could alone. My own style leans toward clean and minimal, but I know when to support more expressive or figurative work from others.</p>
<p>I’m also deeply focused on execution. I care about pixel-perfect visuals at any resolution, and I obsess over loading, compression, and memory use to keep interfaces sharp, lightweight, and fast. I’ve built tech and processes to smooth the handoff between design tools and game engines, making iteration fast and reliable.</p>
<p>And finally, I care a lot about motion. UI shouldn’t just function, it should respond, flow, and reward interaction. Animation is part of how I make interfaces feel good to use.</p>`,
    sections: [{
      heading: ['Key', 'Examples'],
      examples: [
        {
          title: 'CtR Remastered | UI Target',
          body: '<p>For <em>Cut the Rope Remastered</em>, I created the animated UI target. I used animation to make it feel 3D and in-world. I built custom tech to support it, aiming to set a new standard for UI quality at Paladin Studios.</p>',
          media: { img: 'ctrr-level-complete.webp', youtube: 'N_qUeK1k8_I', alt: 'Cut the Rope Remastered level complete screen' },
        },
        {
          title: 'Stormbound | CCG UI',
          body: '<p>I designed and implemented most of the card handling UI for <em>Stormbound</em>. One of the bigger challenges was a 12-card deck management screen built for portrait orientation, a tricky layout problem with no clear reference at the time.</p>',
          media: { img: 'stormbound-ui.webp', youtube: '5Etf_wIpWDc', alt: 'Stormbound deck management UI' },
        },
      ],
    }],
  },
  {
    slug: 'tech-art',
    title: 'Tech Art',
    tileLabel: 'TechArt',
    tile: 'nailed-it-mesh.webp',
    introImg: { img: 'tech-art.webp', alt: 'Nibble Nom and an animation graph' },
    introFit: 'stretch', mediaFirstLeft: true,
    intro: `<p>My career started in art school, and I entered the industry as a 3D artist and UI artist. I was always drawn to the technical side. To gain more control over my workflow, I kept digging into the systems behind the visuals: rigging, shaders, 3ds Max scripting, Unity asset importers, Photoshop automation, animation blending, IK setups, procedural mesh generation, whatever I needed to solve the problem at hand.</p>
<p>Tech art defined the earlier part of my career. These days, I use it mostly in service of gameplay. As a technical designer, I still rely on shader work and animation systems, especially when working on gamefeel. But I’m always ready to jump in and help with difficult visual or pipeline challenges when needed.</p>`,
    sections: [{
      heading: ['Key', 'Examples'],
      examples: [
        {
          title: 'Nailed It! | Mesh-Based Minigames',
          body: '<p>I prototyped several minigames for Netflix’s <em>Nailed It! Baking Bash</em>, including ones that deform and manipulate meshes in real time, like a sculpting game. My tech art background was key in both coming up with these ideas and making them playable.</p>',
          media: { img: 'nailed-it-mesh.webp', youtube: 'Z1oPicOLLew', vertical: true, alt: 'Mesh sculpting minigame in Nailed It! Baking Bash' },
        },
        {
          title: 'Cut the Rope | Thin-Depth Shader',
          body: '<p>I created a shader that makes 3D objects appear paper-thin from the side while preserving full 3D depth from the camera’s view. It solves a core visual challenge in <em>Cut the Rope</em>, making physically impossible rope layouts look consistent and believable in 3D.</p>',
          media: { img: 'nibble-nom-thin.webp', youtube: 'q6-JSXYs6Ik', alt: 'Nibble Nom rendered with the thin-depth shader' },
        },
        {
          title: 'CtR 3 | Nibble Nom Animation',
          body: '<p>I implemented Nibble Nom’s animations, handling his orientation on ropes, slopes, and during bounces. The goal was to give him a sense of agency, even without direct control. I added a layered system for bounce reactions and other orientation- and context-sensitive animations.</p>',
          media: { img: 'nibble-nom-animation.webp', youtube: 'hzl0bCR-lpg', alt: 'Nibble Nom animation states' },
        },
      ],
    }],
  },
];
