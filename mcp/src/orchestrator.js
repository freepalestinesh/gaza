import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Simple job queue orchestrator stub
class JobOrchestrator {
  constructor() {
    this.jobs = [];
    this.redis = null;
  }

  async connect() {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      this.redis = createClient({ url: redisUrl });
      
      this.redis.on('error', (err) => console.log('Redis Client Error', err));
      
      await this.redis.connect();
      console.log('Connected to Redis');
    } catch (error) {
      console.warn('Redis not available, using in-memory queue:', error.message);
    }
  }

  async addJob(jobType, payload) {
    const job = {
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: jobType,
      payload,
      status: 'queued',
      createdAt: new Date().toISOString(),
    };

    if (this.redis) {
      await this.redis.lPush('jobs', JSON.stringify(job));
    } else {
      this.jobs.push(job);
    }

    console.log(`Job added: ${job.id} (${jobType})`);
    return job;
  }

  async getNextJob() {
    if (this.redis) {
      const jobStr = await this.redis.rPop('jobs');
      if (jobStr) {
        return JSON.parse(jobStr);
      }
    } else {
      return this.jobs.shift();
    }
    return null;
  }

  async processJobs() {
    console.log('Job processor started...');
    
    while (true) {
      const job = await this.getNextJob();
      
      if (job) {
        console.log(`Processing job: ${job.id} (${job.type})`);
        
        // Stub job processing - extend this for actual work
        switch (job.type) {
          case 'send_notification':
            console.log(`Would send notification: ${job.payload.message}`);
            break;
          case 'process_donation':
            console.log(`Would process donation: ${job.payload.amount} ${job.payload.currency}`);
            break;
          default:
            console.log(`Unknown job type: ${job.type}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // Wait before checking for new jobs
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  async close() {
    if (this.redis) {
      await this.redis.quit();
    }
  }
}

// Run orchestrator if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const orchestrator = new JobOrchestrator();
  
  await orchestrator.connect();
  
  // Handle shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down orchestrator...');
    await orchestrator.close();
    process.exit(0);
  });
  
  // Start processing
  orchestrator.processJobs().catch(console.error);
}

export default JobOrchestrator;
