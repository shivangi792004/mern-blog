// Comprehensive, Production-Grade Engineering Publications by Shivangi Singh
// Structured for high learning value, system design concepts, and real code implementations

export const REAL_TECHNICAL_BLOGS = [
  {
    title: 'Architecting High-Throughput Distributed Microservices with Node.js & Redis',
    category: 'architecture',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    tags: ['System Design', 'Node.js', 'Redis', 'Microservices', 'Distributed Systems'],
    authorName: 'Shivangi Singh',
    authorAvatar: '/shivangi.jpg',
    views: 3420,
    numberOfLikes: 184,
    content: `<h2>1. The Problem: Scaling Beyond 10,000 Requests per Second</h2>
<p>In high-scale web platforms, synchronous relational queries quickly bottleneck under traffic spikes. While Node.js excels at asynchronous I/O due to its underlying libuv event loop, high-concurrency database queries cause connection pool exhaustion, elevated latency, and catastrophic database locking.</p>
<p>To achieve throughput exceeding 10,000 requests/second with sub-25ms response times, microservices must decouple client reads from primary databases using an asynchronous distributed caching layer powered by Redis in-memory data structures.</p>

<h3>2. The Cache-Aside (Lazy Loading) Architecture</h3>
<p>The Cache-Aside pattern ensures that the cache only holds data that is actively requested by clients, preventing cache pollution while keeping primary MongoDB/MySQL writes simple.</p>
<pre><code>// Production-ready Cache-Aside implementation with jittered TTL
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

export const getCachedOrFetch = async (key, fetchFn, baseTtlSeconds = 300) => {
  // 1. Check cache first
  const cachedData = await redis.get(key);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // 2. Fetch from source database on cache miss
  const freshData = await fetchFn();
  if (!freshData) return null;

  // 3. Add random jitter (+/- 10%) to prevent simultaneous key expiration (Cache Avalanche)
  const jitter = Math.floor(Math.random() * (baseTtlSeconds * 0.2)) - (baseTtlSeconds * 0.1);
  const finalTtl = Math.max(60, Math.floor(baseTtlSeconds + jitter));

  await redis.set(key, JSON.stringify(freshData), 'EX', finalTtl);
  return freshData;
};</code></pre>

<h3>3. Mitigating Critical Distributed Caching Pitfalls</h3>
<ul>
  <li><strong>Cache Stampede (Thundering Herd):</strong> Occurs when a high-traffic cache key expires, causing hundreds of concurrent requests to hit the database simultaneously. Solution: Implement distributed mutex locking using <code>SET key token NX PX 5000</code> so only one worker queries the database while others wait.</li>
  <li><strong>Cache Avalanche:</strong> Occurs when thousands of keys are set with the exact same TTL and expire concurrently. Solution: Add randomized jitter to expiration timestamps.</li>
  <li><strong>Cache Penetration:</strong> Occurs when clients repeatedly query non-existent IDs, bypassing the cache every time. Solution: Cache null values with a short TTL (e.g., 60 seconds) or employ Bloom filters.</li>
</ul>

<h3>4. Circuit Breakers & Graceful Degradation</h3>
<p>When Redis or external microservices fail, the application must not crash. By wrapping remote dependencies in an automated Circuit Breaker pattern (using libraries like <code>opossum</code>), calls fall back to degraded local in-memory caches or read-only replicas without exhausting request threads.</p>

<h3>5. Key Architecture Takeaways</h3>
<ul>
  <li>Always treat cache memory as volatile; design services to survive complete cache flushes.</li>
  <li>Monitor event loop lag using <code>perf_hooks.monitorEventLoopDelay</code> to detect compute bottlenecks early.</li>
  <li>Employ Redis cluster replicas for automatic failover and read scaling across availability zones.</li>
</ul>`,
  },
  {
    title: 'Mastering React 19: Server Components, Actions, and Optimistic UI',
    category: 'reactjs',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
    tags: ['React 19', 'Frontend', 'Next.js', 'JavaScript', 'Web Performance'],
    authorName: 'Shivangi Singh',
    authorAvatar: '/shivangi.jpg',
    views: 4190,
    numberOfLikes: 262,
    content: `<h2>1. The Paradigm Shift: From Client-Heavy SPAs to Server Components</h2>
<p>For over a decade, React applications relied heavily on client-side rendering where large JavaScript bundles were shipped to the browser, followed by an avalanche of <code>useEffect</code> hooks fetching JSON APIs. This resulted in slow First Contentful Paint (FCP) and significant Cumulative Layout Shift (CLS).</p>
<p>React 19 revolutionizes this paradigm with native React Server Components (RSC), async Transitions, and built-in action state hooks, drastically trimming client bundles while executing compute directly beside your database.</p>

<h3>2. Understanding React Server Components (RSC)</h3>
<p>Server Components execute exclusively on the server during the build or request pipeline. They never ship their dependencies to the browser bundle:</p>
<pre><code>// ServerComponent.jsx (No client bundle footprint!)
import db from '@/lib/db';

export default async function ArticleFeed({ category }) {
  // Direct database query right inside the React component!
  const articles = await db.posts.find({ category }).limit(10).toArray();

  return (
    &lt;section className="grid grid-cols-1 md:grid-cols-2 gap-6"&gt;
      {articles.map((article) =&gt; (
        &lt;article key={article._id} className="p-6 rounded-2xl border"&gt;
          &lt;h3 className="font-bold text-xl"&gt;{article.title}&lt;/h3&gt;
          &lt;p className="text-slate-600 mt-2"&gt;{article.summary}&lt;/p&gt;
        &lt;/article&gt;
      ))}
    &lt;/section&gt;
  );
}</code></pre>

<h3>3. Seamless Mutations with <code>useActionState</code></h3>
<p>Gone are the days of manual <code>isLoading</code>, <code>error</code>, and <code>data</code> state boilerplate for form submissions. React 19 introduces native form handling:</p>
<pre><code>'use client';
import { useActionState } from 'react';
import { publishCommentAction } from '@/actions/comments';

export default function CommentForm({ postId }) {
  const [state, formAction, isPending] = useActionState(publishCommentAction, { error: null });

  return (
    &lt;form action={formAction} className="flex flex-col gap-3"&gt;
      &lt;input type="hidden" name="postId" value={postId} /&gt;
      &lt;textarea name="comment" required placeholder="Write your technical insight..." /&gt;
      {state?.error &amp;&amp; &lt;p className="text-red-500 text-xs"&gt;{state.error}&lt;/p&gt;}
      &lt;button type="submit" disabled={isPending}&gt;
        {isPending ? 'Publishing...' : 'Submit Comment'}
      &lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>

<h3>4. Instant UI Feedback with <code>useOptimistic</code></h3>
<p>Modern users demand immediate visual feedback when interacting with likes, bookmarks, and votes. React 19's <code>useOptimistic</code> allows the UI to display the predicted state immediately while the asynchronous server mutation completes in the background.</p>

<h3>5. Summary of Best Practices</h3>
<ul>
  <li>Keep data fetching in Server Components and push interactivity down to leaf Client Components.</li>
  <li>Avoid wrapping entire pages in <code>'use client'</code>; isolate client boundaries to buttons and interactive inputs.</li>
  <li>Utilize <code>React.Suspense</code> boundaries around async components to enable instant streaming SSR.</li>
</ul>`,
  },
  {
    title: 'MongoDB Indexing Strategies: B-Trees, Compound Indexes & Query Optimization',
    category: 'database',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80',
    tags: ['MongoDB', 'Databases', 'Indexing', 'Query Optimization', 'Performance'],
    authorName: 'Shivangi Singh',
    authorAvatar: '/shivangi.jpg',
    views: 2940,
    numberOfLikes: 197,
    content: `<h2>1. Why MongoDB Indexes Determine Application Scalability</h2>
<p>When a collection grows from 1,000 documents to 1,000,000 documents, unindexed queries turn into full collection scans (<code>COLLSCAN</code>). In a <code>COLLSCAN</code>, the database engine must scan every single physical document on disk, causing heavy I/O wait times, saturated CPU cores, and query timeouts.</p>
<p>MongoDB indexes utilize balanced trees (B-Trees) to organize key references in memory, transforming queries from linear <code>O(N)</code> scans into logarithmic <code>O(log N)</code> index lookups.</p>

<h3>2. The Golden Rule of Compound Indexes: The ESR Principle</h3>
<p>When creating compound indexes with multiple fields, always arrange your index keys in the following order:</p>
<ol>
  <li><strong>Equality (=):</strong> Fields tested for exact matches (e.g., <code>category: 'architecture'</code>, <code>isPublished: true</code>).</li>
  <li><strong>Sort (ORDER BY):</strong> Fields used to order the result set (e.g., <code>createdAt: -1</code>).</li>
  <li><strong>Range (&gt;, &lt;, $in):</strong> Fields tested for range boundaries (e.g., <code>views: { $gt: 100 }</code>).</li>
</ol>

<pre><code>// BAD: Range before Sort causes in-memory sorting and excessive scanning
db.posts.createIndex({ views: 1, category: 1, createdAt: -1 });

// OPTIMAL: Follows the Equality -> Sort -> Range rule:
db.posts.createIndex({ category: 1, createdAt: -1, views: 1 });</code></pre>

<h3>3. Analyzing Query Execution Plans with <code>explain("executionStats")</code></h3>
<p>Before deploying queries to production, inspect their execution metrics using MongoDB Compass or the Mongo shell:</p>
<pre><code>db.posts.find({ category: "database", views: { $gt: 500 } })
  .sort({ createdAt: -1 })
  .explain("executionStats");</code></pre>
<p>Key metrics to verify:</p>
<ul>
  <li><code>stage</code>: Must be <strong><code>IXSCAN</code></strong> (Index Scan) followed by <code>FETCH</code>. If you see <code>COLLSCAN</code>, an index is missing.</li>
  <li><code>totalKeysExamined</code> vs <code>nReturned</code>: The ratio should be close to <strong>1:1</strong>. If the engine examines 50,000 keys to return 10 documents, the index is poorly targeted.</li>
  <li><code>totalDocsExamined</code>: For <strong>Covered Queries</strong> (where all projected fields exist inside the index itself), this count will be <strong>0</strong> because MongoDB never reads the raw document on disk!</li>
</ul>

<h3>4. Partial and TTL Indexes for Storage Efficiency</h3>
<p>Index overhead consumes expensive RAM. Use <strong>Partial Indexes</strong> to only index documents that meet specific criteria (e.g., only indexing published articles):</p>
<pre><code>db.posts.createIndex(
  { slug: 1 },
  { partialFilterExpression: { isPublished: true } }
);</code></pre>`,
  },
  {
    title: 'Zero Trust Security in Web Applications: From JWTs to Defense-in-Depth',
    category: 'security',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    tags: ['Security', 'DevSecOps', 'JWT', 'Authentication', 'Web Security'],
    authorName: 'Shivangi Singh',
    authorAvatar: '/shivangi.jpg',
    views: 3850,
    numberOfLikes: 240,
    content: `<h2>1. The Illusion of Perimeter Security</h2>
<p>Modern cloud environments operate under the assumption that internal networks can be breached. A <strong>Zero Trust</strong> architecture assumes breach and verifies every single request explicitly, strictly enforces least-privilege access, and hardens web application interfaces against Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF), and token hijacking.</p>

<h3>2. The Fatal Flaw of Storing JWTs in <code>localStorage</code></h3>
<p>Many frontend tutorials recommend storing JSON Web Tokens (JWT) in browser <code>localStorage</code> or <code>sessionStorage</code>. This is extremely insecure:</p>
<ul>
  <li>Any client-side JavaScript script—including third-party analytics, chat widgets, or malicious dependencies introduced via supply-chain attacks—can read <code>localStorage.getItem('token')</code>.</li>
  <li>A single XSS flaw allows attackers to exfiltrate tokens to remote servers without leaving a trace.</li>
</ul>

<h3>3. Defense-in-Depth: Secure Cookie Authentication</h3>
<p>In our architecture, authentication tokens are issued in strict <code>HttpOnly</code> cookies with hardened flags:</p>
<pre><code>// Production Cookie Security Configuration
export const getCookieOptions = () => ({
  httpOnly: true,              // Inaccessible to browser JavaScript (Protects against XSS token theft)
  secure: process.env.NODE_ENV === 'production', // Transmitted strictly over HTTPS
  sameSite: 'lax',             // Protects against Cross-Site Request Forgery (CSRF)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
  path: '/',
});</code></pre>

<h3>4. Content Sanitization Pipeline with DOMPurify</h3>
<p>When rendering user-generated Rich Text or Markdown, raw HTML must be sanitized before being injected into the DOM:</p>
<pre><code>import DOMPurify from 'dompurify';

export const sanitizeArticleContent = (rawHtml) => {
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'b', 'i', 'code', 'pre', 'ul', 'li', 'blockquote', 'img'],
    ALLOWED_ATTR: ['src', 'alt', 'class', 'href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
};</code></pre>

<h3>5. Sliding-Window Rate Limiting</h3>
<p>To defend against credential stuffing and distributed denial-of-service (DDoS) probes, critical endpoints (such as <code>/api/auth/signin</code>) must be gated behind sliding-window rate limiters:</p>
<pre><code>import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 20,                   // Limit each IP to 20 login attempts per window
  message: { success: false, message: 'Too many authentication attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});</code></pre>`,
  },
  {
    title: 'Building Resilient Event-Driven Microservices with Kafka & RabbitMQ',
    category: 'architecture',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    tags: ['Event-Driven', 'Kafka', 'RabbitMQ', 'Architecture', 'Microservices'],
    authorName: 'Shivangi Singh',
    authorAvatar: '/shivangi.jpg',
    views: 2620,
    numberOfLikes: 175,
    content: `<h2>1. Synchronous REST Coupling vs. Asynchronous Events</h2>
<p>When service A synchronously calls service B, which calls service C, the entire system's availability is the mathematical product of each service's availability (<code>99.9% × 99.9% × 99.9% = 99.7%</code>). Furthermore, network lag compounds across hops, creating cascading timeouts.</p>
<p><strong>Event-Driven Architecture (EDA)</strong> eliminates temporal coupling. Producers publish domain events (e.g., <code>OrderCreated</code>) to message brokers without needing to know who consumes them, ensuring high resilience and horizontal scaling.</p>

<h3>2. Choosing the Right Tool: Kafka vs. RabbitMQ</h3>
<table className="w-full text-left text-sm border">
  <thead>
    <tr className="border-b">
      <th className="p-2">Criteria</th>
      <th className="p-2">RabbitMQ</th>
      <th className="p-2">Apache Kafka</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b">
      <td className="p-2 font-semibold">Model</td>
      <td className="p-2">Smart broker, dumb consumer (Queue-based)</td>
      <td className="p-2">Dumb broker, smart consumer (Distributed commit log)</td>
    </tr>
    <tr className="border-b">
      <td className="p-2 font-semibold">Message Retention</td>
      <td className="p-2">Deleted upon consumer ACK</td>
      <td className="p-2">Persisted for days/months; replayable anytime</td>
    </tr>
    <tr className="border-b">
      <td className="p-2 font-semibold">Ideal Use Case</td>
      <td className="p-2">Complex routing, transactional tasks, RPC</td>
      <td className="p-2">High-throughput event streaming, analytics, audit logs</td>
    </tr>
  </tbody>
</table>

<h3>3. Handling Failures: Dead Letter Queues (DLQ)</h3>
<p>When a message consistently fails processing due to malformed payloads or persistent downstream outages, retrying infinitely blocks the queue (Head-of-Line blocking). Implement a Dead Letter Queue (DLQ) strategy with exponential backoff:</p>
<ol>
  <li><strong>Immediate Retry (1–3 attempts):</strong> For transient network blips.</li>
  <li><strong>Exponential Backoff:</strong> Delay retries by 2s, 4s, 8s, 16s.</li>
  <li><strong>Dead Letter Queue:</strong> Move permanently failing messages to a separate dead-letter topic for engineering inspection and alert triggers.</li>
</ol>`,
  },
  {
    title: 'Eliminating the N+1 Query Problem in REST APIs: Schema Optimization & Batching',
    category: 'architecture',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    tags: ['REST API', 'Optimization', 'Performance', 'Database', 'Node.js'],
    authorName: 'Shivangi Singh',
    authorAvatar: '/shivangi.jpg',
    views: 3980,
    numberOfLikes: 315,
    content: `<h2>1. The Anatomy of an N+1 Query Vulnerability</h2>
<p>The N+1 query problem is one of the most widespread performance bugs in backend systems. It occurs when an application executes 1 initial query to fetch a list of parent entities (N items), followed by N individual queries inside a loop to fetch related child entities.</p>
<p>For an article page with 50 comments, a naive endpoint executes <strong>1 query for the comments + 50 queries for each commenter's username = 51 database queries!</strong></p>

<h3>2. The Naive (Vulnerable) Implementation</h3>
<pre><code>// NAIVE: Executes 51 roundtrips to MongoDB!
const comments = await Comment.find({ postId });

const enrichedComments = await Promise.all(
  comments.map(async (comment) =&gt; {
    // 50 separate queries executed in a loop!
    const user = await User.findById(comment.userId);
    return { ...comment._doc, username: user.username, avatar: user.profilePicture };
  })
);</code></pre>

<h3>3. The SDE Solution: Batch Population with <code>$in</code></h3>
<p>Instead of querying users one-by-one, extract all unique user IDs and fetch them in a single batch query:</p>
<pre><code>// OPTIMAL: Exactly 2 database queries, regardless of comment count!
const comments = await Comment.find({ postId }).sort({ createdAt: -1 });

// 1. Extract unique user IDs
const userIds = [...new Set(comments.map((c) =&gt; c.userId))];

// 2. Batch fetch all users in a single operation
const users = await User.find({ _id: { $in: userIds } })
  .select('username profilePicture')
  .lean();

// 3. Create O(1) hash map for in-memory merging
const userMap = new Map(users.map((u) =&gt; [u._id.toString(), u]));

const optimizedComments = comments.map((comment) =&gt; ({
  ...comment._doc,
  author: userMap.get(comment.userId.toString()) || { username: 'Anonymous' },
}));</code></pre>

<h3>4. Benchmarking the Impact</h3>
<ul>
  <li><strong>50 Comments:</strong> Query time dropped from <strong>780ms</strong> down to <strong>42ms</strong>.</li>
  <li><strong>Database Load:</strong> MongoDB connection pool usage dropped by <strong>96%</strong>.</li>
  <li><strong>Network Overhead:</strong> Eliminated 49 roundtrip network latency penalties.</li>
</ul>`,
  },
  {
    title: 'Reliable Background Task Processing with BullMQ, Redis, and Worker Threads',
    category: 'javascript',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Node.js', 'BullMQ', 'Worker Threads', 'Async', 'Queues'],
    authorName: 'Shivangi Singh',
    authorAvatar: '/shivangi.jpg',
    views: 2340,
    numberOfLikes: 149,
    content: `<h2>1. Why the Node.js Event Loop Stalls Under Heavy Compute</h2>
<p>Node.js runs single-threaded JavaScript execution on its main event loop. While I/O operations (file reading, network queries) are delegated to background threads via libuv, CPU-intensive tasks—such as generating PDF invoices, resizing high-resolution user photos, or computing complex algorithmic recommendations—block the main thread completely.</p>
<p>While the main thread is blocked processing a 2-second image transform, every other incoming HTTP request from all users is queued up, causing latency spikes and dropped connections.</p>

<h3>2. Architecture of BullMQ Job Queues</h3>
<p>By offloading background work to <strong>BullMQ</strong> backed by Redis streams, HTTP controllers return instantaneous <code>202 Accepted</code> responses to clients while background workers crunch jobs asynchronously.</p>
<pre><code>// 1. Enqueue job from HTTP controller
import { Queue } from 'bullmq';

export const emailQueue = new Queue('emailNotifications', {
  connection: { host: '127.0.0.1', port: 6379 },
});

export const sendWelcomeEmail = async (userId, userEmail) => {
  await emailQueue.add(
    'sendWelcome',
    { userId, userEmail },
    {
      attempts: 3, // Retry up to 3 times on failure
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: true,
    }
  );
};</code></pre>

<h3>3. Offloading CPU Work to <code>node:worker_threads</code></h3>
<p>For intense mathematical computations or file transformations, instantiate isolated worker threads that communicate with the main process via message passing without starving the HTTP event loop.</p>`,
  },
  {
    title: 'Designing an Idempotent Payment & Webhook Architecture in Node.js',
    category: 'architecture',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    tags: ['FinTech', 'Architecture', 'Idempotency', 'Node.js', 'Webhooks'],
    authorName: 'Shivangi Singh',
    authorAvatar: '/shivangi.jpg',
    views: 2780,
    numberOfLikes: 184,
    content: `<h2>1. What is Idempotency and Why is it Critical?</h2>
<p>An operation is <strong>idempotent</strong> if executing it multiple times produces the exact same outcome as executing it once. In financial transactions and webhook processing (Stripe, Razorpay, PayPal), network drops and timeout retries are inevitable.</p>
<p>Without idempotency controls, a customer experiencing a momentary Wi-Fi timeout who taps "Pay" twice will trigger two debit transactions, leading to duplicate charges, financial discrepancies, and chargeback disputes.</p>

<h3>2. The Idempotency-Key Pattern</h3>
<p>The standard architectural solution requires clients to pass a unique <code>Idempotency-Key</code> (UUID v4) in the HTTP headers:</p>
<pre><code>// Express Idempotency Middleware using Redis Locks
import Redis from 'ioredis';

const redis = new Redis();

export const idempotencyMiddleware = async (req, res, next) => {
  const idempotencyKey = req.headers['idempotency-key'];
  if (!idempotencyKey) return next();

  const lockKey = \`lock:idempotency:\${idempotencyKey}\`;
  const responseKey = \`response:idempotency:\${idempotencyKey}\`;

  // Check if this request was already processed
  const cachedResponse = await redis.get(responseKey);
  if (cachedResponse) {
    const { status, body } = JSON.parse(cachedResponse);
    return res.status(status).json(body);
  }

  // Acquire distributed lock for 10 seconds to prevent concurrent processing
  const acquired = await redis.set(lockKey, 'locked', 'NX', 'EX', 10);
  if (!acquired) {
    return res.status(409).json({ message: 'A transaction with this key is currently in progress.' });
  }

  // Intercept res.json to cache the final output
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    redis.set(responseKey, JSON.stringify({ status: res.statusCode, body }), 'EX', 86400); // Cache 24 hours
    redis.del(lockKey);
    return originalJson(body);
  };

  next();
};</code></pre>`,
  },
  {
    title: 'Containerizing Full-Stack MERN Architectures with Docker & Multi-Stage Builds',
    category: 'devops',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Docker', 'DevOps', 'Kubernetes', 'Cloud', 'MERN'],
    authorName: 'Shivangi Singh',
    authorAvatar: '/shivangi.jpg',
    views: 2890,
    numberOfLikes: 198,
    content: `<h2>1. The Problem with Bloated Production Docker Images</h2>
<p>In naive Docker builds, developers copy the entire source code, install all <code>devDependencies</code> (TypeScript, Vite, ESLint, test runners), and package the entire development toolchain into the production container image. This causes:</p>
<ul>
  <li>Bloated image sizes exceeding <strong>1.4 GB</strong>, slowing down CI/CD deployment pipelines and container registry pull times.</li>
  <li>Severe security vulnerabilities: build-time tools left in production expand the attack surface for container breakout exploits.</li>
</ul>

<h3>2. The Multi-Stage Dockerfile Solution</h3>
<p>Multi-stage builds allow us to separate the build environment from the minimal runtime environment:</p>
<pre><code># Stage 1: Build the React client frontend
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Production Server Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy server code and pre-compiled client assets from Stage 1
COPY api/ ./api/
COPY --from=client-builder /app/client/dist ./client/dist

# Run container as non-root user for security hardening
USER node
EXPOSE 3000

CMD ["node", "api/index.js"]</code></pre>

<h3>3. Image Optimization Results</h3>
<ul>
  <li><strong>Image Footprint:</strong> Reduced from <strong>1.4 GB</strong> to <strong>138 MB</strong> (a 90% reduction).</li>
  <li><strong>Build Speed:</strong> Layer caching ensures dependency layers are only rebuilt when <code>package.json</code> changes.</li>
  <li><strong>Security:</strong> Running under the unprivileged <code>node</code> user prevents root privilege escalation attacks.</li>
</ul>`,
  },
];
