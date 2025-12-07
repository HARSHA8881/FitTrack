import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/jwt.js';

const prisma = new PrismaClient();

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Signup error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Full error:', JSON.stringify(error, null, 2));

    // Handle Prisma unique constraint error on email
    if (error.code === 'P2002' && Array.isArray(error.meta?.target) && error.meta.target.includes('email')) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Handle database connection errors
    if (error.code === 'P1001' || error.message?.includes('Can\'t reach database server')) {
      return res.status(500).json({
        message: 'Database connection failed',
        detail: 'Please check if MySQL is running and DATABASE_URL is correct'
      });
    }

    // Surface more detail during development to help debugging
    return res.status(500).json({
      message: 'Error creating user',
      detail: error.message,
      code: error.code
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

export const getMe = async (req, res) => {
  try {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// ============================================
// PROFILE MANAGEMENT
// ============================================

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        fitnessGoal: true,
        experienceLevel: true,
        level: true,
        xp: true,
        totalPoints: true,
        currentStreak: true,
        longestStreak: true,
        preferredUnits: true,
        weeklyGoal: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      avatar,
      bio,
      fitnessGoal,
      experienceLevel,
      preferredUnits,
      weeklyGoal,
      isPublic
    } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(avatar !== undefined && { avatar }),
        ...(bio !== undefined && { bio }),
        ...(fitnessGoal !== undefined && { fitnessGoal }),
        ...(experienceLevel && { experienceLevel }),
        ...(preferredUnits && { preferredUnits }),
        ...(weeklyGoal !== undefined && { weeklyGoal }),
        ...(isPublic !== undefined && { isPublic })
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        fitnessGoal: true,
        experienceLevel: true,
        preferredUnits: true,
        weeklyGoal: true,
        isPublic: true,
        updatedAt: true
      }
    });

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// ============================================
// GOALS MANAGEMENT
// ============================================

export const getGoals = async (req, res) => {
  try {
    const { status } = req.query;

    const goals = await prisma.goal.findMany({
      where: {
        userId: req.user.id,
        ...(status && { status })
      },
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    res.json(goals);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ message: 'Error fetching goals' });
  }
};

export const createGoal = async (req, res) => {
  try {
    const {
      title,
      description,
      goalType,
      targetValue,
      currentValue,
      unit,
      targetDate
    } = req.body;

    if (!title || !goalType) {
      return res.status(400).json({ message: 'Title and goal type are required' });
    }

    const goal = await prisma.goal.create({
      data: {
        userId: req.user.id,
        title,
        description,
        goalType,
        targetValue: targetValue ? parseFloat(targetValue) : null,
        currentValue: currentValue ? parseFloat(currentValue) : 0,
        unit,
        targetDate: targetDate ? new Date(targetDate) : null
      }
    });

    res.status(201).json({ message: 'Goal created successfully', goal });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ message: 'Error creating goal' });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      goalType,
      targetValue,
      currentValue,
      unit,
      targetDate,
      status
    } = req.body;

    // Verify goal belongs to user
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id
      }
    });

    if (!existingGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    const goal = await prisma.goal.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(goalType && { goalType }),
        ...(targetValue !== undefined && { targetValue: targetValue ? parseFloat(targetValue) : null }),
        ...(currentValue !== undefined && { currentValue: currentValue ? parseFloat(currentValue) : 0 }),
        ...(unit !== undefined && { unit }),
        ...(targetDate !== undefined && { targetDate: targetDate ? new Date(targetDate) : null }),
        ...(status && {
          status,
          ...(status === 'completed' && !existingGoal.completedAt && { completedAt: new Date() })
        })
      }
    });

    res.json({ message: 'Goal updated successfully', goal });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ message: 'Error updating goal' });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify goal belongs to user
    const goal = await prisma.goal.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id
      }
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    await prisma.goal.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ message: 'Error deleting goal' });
  }
};

// ============================================
// BODY METRICS MANAGEMENT
// ============================================

export const getBodyMetrics = async (req, res) => {
  try {
    const { metricType, startDate, endDate, limit } = req.query;

    const where = {
      userId: req.user.id,
      ...(metricType && { metricType }),
      ...(startDate && endDate && {
        recordedAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    };

    const metrics = await prisma.bodyMetric.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      ...(limit && { take: parseInt(limit) })
    });

    res.json(metrics);
  } catch (error) {
    console.error('Get body metrics error:', error);
    res.status(500).json({ message: 'Error fetching body metrics' });
  }
};

export const createBodyMetric = async (req, res) => {
  try {
    const { metricType, value, unit, notes, recordedAt } = req.body;

    if (!metricType || value === undefined || !unit) {
      return res.status(400).json({ message: 'Metric type, value, and unit are required' });
    }

    const metric = await prisma.bodyMetric.create({
      data: {
        userId: req.user.id,
        metricType,
        value: parseFloat(value),
        unit,
        notes,
        recordedAt: recordedAt ? new Date(recordedAt) : new Date()
      }
    });

    res.status(201).json({ message: 'Body metric logged successfully', metric });
  } catch (error) {
    console.error('Create body metric error:', error);
    res.status(500).json({ message: 'Error logging body metric' });
  }
};

export const updateBodyMetric = async (req, res) => {
  try {
    const { id } = req.params;
    const { metricType, value, unit, notes, recordedAt } = req.body;

    // Verify metric belongs to user
    const existingMetric = await prisma.bodyMetric.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id
      }
    });

    if (!existingMetric) {
      return res.status(404).json({ message: 'Body metric not found' });
    }

    const metric = await prisma.bodyMetric.update({
      where: { id: parseInt(id) },
      data: {
        ...(metricType && { metricType }),
        ...(value !== undefined && { value: parseFloat(value) }),
        ...(unit && { unit }),
        ...(notes !== undefined && { notes }),
        ...(recordedAt && { recordedAt: new Date(recordedAt) })
      }
    });

    res.json({ message: 'Body metric updated successfully', metric });
  } catch (error) {
    console.error('Update body metric error:', error);
    res.status(500).json({ message: 'Error updating body metric' });
  }
};

export const deleteBodyMetric = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify metric belongs to user
    const metric = await prisma.bodyMetric.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id
      }
    });

    if (!metric) {
      return res.status(404).json({ message: 'Body metric not found' });
    }

    await prisma.bodyMetric.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Body metric deleted successfully' });
  } catch (error) {
    console.error('Delete body metric error:', error);
    res.status(500).json({ message: 'Error deleting body metric' });
  }
};
