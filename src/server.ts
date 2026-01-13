import app from './app';
import { config } from './config/env';
import './workers/post-publisher.worker'; // Initialize the worker

const port = config.port;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});