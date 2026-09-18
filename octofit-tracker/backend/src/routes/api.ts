import { Router } from 'express';
import mongoose from 'mongoose';
import { Activity, Team, User, Workout } from '../models.js';

export const apiRouter = Router();

function requireObjectId(value: string): boolean {
  return mongoose.isValidObjectId(value);
}

apiRouter.get('/users', async (_, response, next) => {
  try { response.json(await User.find().sort({ createdAt: -1 })); } catch (error) { next(error); }
});

apiRouter.post('/users', async (request, response, next) => {
  try { response.status(201).json(await User.create(request.body)); } catch (error) { next(error); }
});

apiRouter.get('/activities', async (request, response, next) => {
  try {
    const filter = request.query.userId ? { userId: request.query.userId } : {};
    response.json(await Activity.find(filter).populate('userId', 'username displayName').sort({ completedAt: -1 }));
  } catch (error) { next(error); }
});

apiRouter.post('/activities', async (request, response, next) => {
  try {
    if (!request.body.userId || !requireObjectId(request.body.userId)) {
      response.status(400).json({ error: 'A valid userId is required' });
      return;
    }
    const activity = await Activity.create({ ...request.body, points: request.body.points ?? request.body.durationMinutes });
    response.status(201).json(await activity.populate('userId', 'username displayName'));
  } catch (error) { next(error); }
});

apiRouter.get('/teams', async (_, response, next) => {
  try { response.json(await Team.find().populate('memberIds', 'username displayName')); } catch (error) { next(error); }
});

apiRouter.post('/teams', async (request, response, next) => {
  try { response.status(201).json(await Team.create(request.body)); } catch (error) { next(error); }
});

apiRouter.post('/teams/:teamId/members/:userId', async (request, response, next) => {
  try {
    if (!requireObjectId(request.params.teamId) || !requireObjectId(request.params.userId)) {
      response.status(400).json({ error: 'Invalid teamId or userId' });
      return;
    }
    const team = await Team.findByIdAndUpdate(request.params.teamId, { $addToSet: { memberIds: request.params.userId } }, { new: true })
      .populate('memberIds', 'username displayName');
    if (!team) { response.status(404).json({ error: 'Team not found' }); return; }
    response.json(team);
  } catch (error) { next(error); }
});

apiRouter.get('/leaderboard', async (_, response, next) => {
  try {
    response.json(await Activity.aggregate([
      { $group: { _id: '$userId', points: { $sum: '$points' }, activities: { $sum: 1 } } },
      { $sort: { points: -1 } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { _id: 0, userId: '$_id', username: '$user.username', displayName: '$user.displayName', points: 1, activities: 1 } },
    ]));
  } catch (error) { next(error); }
});

apiRouter.get('/workouts', async (request, response, next) => {
  try {
    const filter = request.query.fitnessLevel ? { fitnessLevel: request.query.fitnessLevel } : {};
    response.json(await Workout.find(filter).sort({ createdAt: -1 }));
  } catch (error) { next(error); }
});

apiRouter.post('/workouts', async (request, response, next) => {
  try { response.status(201).json(await Workout.create(request.body)); } catch (error) { next(error); }
});
