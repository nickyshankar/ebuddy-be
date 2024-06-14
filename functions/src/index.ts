import * as functions from 'firebase-functions';
import * as express from 'express';
import userRoutes from './routes/userRoutes';


const cors = require('cors');
const app = express();

app.use(cors());

app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json());
app.use('/api/users', userRoutes);

exports.eBuddyRestAPI = functions.https.onRequest(app);