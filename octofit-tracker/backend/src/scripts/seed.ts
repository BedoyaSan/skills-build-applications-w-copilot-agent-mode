import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { Activity, Leaderboard, Team, User, Workout } from '../models.js';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase(): Promise<void> {
  try {
    await connectDatabase();

    await Promise.all([
      User.deleteMany({}),
      Activity.deleteMany({}),
      Team.deleteMany({}),
      Leaderboard.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      { username: 'maya-chen', email: 'maya.chen@example.com', displayName: 'Maya Chen', fitnessLevel: 'intermediate' },
      { username: 'jordan-rivera', email: 'jordan.rivera@example.com', displayName: 'Jordan Rivera', fitnessLevel: 'beginner' },
      { username: 'sam-okafor', email: 'sam.okafor@example.com', displayName: 'Sam Okafor', fitnessLevel: 'advanced' },
      { username: 'riley-patel', email: 'riley.patel@example.com', displayName: 'Riley Patel', fitnessLevel: 'beginner' },
    ]);

    await Team.insertMany([
      { name: 'Trailblazers', memberIds: [users[0]._id, users[2]._id] },
      { name: 'Step Squad', memberIds: [users[1]._id, users[3]._id] },
    ]);

    const activities = await Activity.insertMany([
      { userId: users[0]._id, type: 'running', durationMinutes: 35, distanceKm: 5.2, points: 52, completedAt: new Date('2026-09-15T16:30:00Z') },
      { userId: users[0]._id, type: 'strength', durationMinutes: 25, points: 30, completedAt: new Date('2026-09-17T16:30:00Z') },
      { userId: users[1]._id, type: 'walking', durationMinutes: 30, distanceKm: 2.4, points: 30, completedAt: new Date('2026-09-16T16:30:00Z') },
      { userId: users[2]._id, type: 'running', durationMinutes: 45, distanceKm: 7.1, points: 71, completedAt: new Date('2026-09-14T16:30:00Z') },
      { userId: users[2]._id, type: 'strength', durationMinutes: 40, points: 48, completedAt: new Date('2026-09-18T16:30:00Z') },
      { userId: users[3]._id, type: 'walking', durationMinutes: 20, distanceKm: 1.6, points: 20, completedAt: new Date('2026-09-13T16:30:00Z') },
    ]);

    const pointsByUser = new Map<string, number>();
    for (const activity of activities) {
      const userId = activity.userId.toString();
      pointsByUser.set(userId, (pointsByUser.get(userId) || 0) + activity.points);
    }
    const rankedUsers = [...pointsByUser.entries()].sort((left, right) => right[1] - left[1]);
    await Leaderboard.insertMany(rankedUsers.map(([userId, points], index) => ({
      userId,
      points,
      rank: index + 1,
      period: 'all-time',
    })));

    await Workout.insertMany([
      { title: 'Easy 20-minute walk', description: 'Build a steady movement habit with a comfortable walk.', fitnessLevel: 'beginner', durationMinutes: 20, activityType: 'walking' },
      { title: 'Run and recover', description: 'Alternate running and walking for a balanced cardio session.', fitnessLevel: 'intermediate', durationMinutes: 30, activityType: 'running' },
      { title: 'Full-body strength', description: 'A simple bodyweight circuit for the major muscle groups.', fitnessLevel: 'advanced', durationMinutes: 35, activityType: 'strength' },
    ]);
    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

void seedDatabase();
