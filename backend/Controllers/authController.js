const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../schema/User');

// ── Helper: Update Stats, Create JWT and set cookie ──
const sendTokenResponse = async (user, statusCode, res, isNewLogin = false) => {
  if (isNewLogin) {
    const now = new Date();
    const lastLogin = user.loginStats?.lastLoginDate;
    let newDailyCount = user.loginStats?.dailyCount || 0;

    if (lastLogin && lastLogin.toDateString() === now.toDateString()) {
      newDailyCount += 1;
    } else {
      newDailyCount = 1;
    }
    user.lastActive = now;
    user.loginStats = { lastLoginDate: now, dailyCount: newDailyCount };
    await user.save();
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  const cookieOptions = {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  };

  res.cookie('token', token, cookieOptions);

  // Remove password from output
  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    photo: user.photo,
    provider: user.provider,
    role: user.role,
    lastActive: user.lastActive,
  };

  res.status(statusCode).json({
    success: true,
    token,
    user: userData,
  });
};

// ── SIGNUP ──
exports.signup = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered. Please sign in.' });
    }

    // First user becomes admin
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'user';

    const user = await User.create({ name, email, password, mobile: mobile || '', role });
    await sendTokenResponse(user, 201, res, true);
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ── SIGNIN ──
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Get user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.provider === 'google') {
      return res.status(401).json({ success: false, message: 'Please sign in with Google.' });
    }

    const isMatch = user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    await sendTokenResponse(user, 200, res, true);
  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ── SIGNOUT ──
exports.signout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(200).json({ success: true, message: 'Signed out successfully.' });
};

// ── GET CURRENT USER ──
exports.getMe = async (req, res) => {
  try {
    let token;
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(200).json({ success: false, user: null });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(200).json({ success: false, user: null });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        photo: user.photo,
        provider: user.provider,
        role: user.role,
        lastActive: user.lastActive,
      },
    });
  } catch (err) {
    // Return 200 with success: false so browser doesn't throw 401 error in console
    res.status(200).json({ success: false, user: null });
  }
};

// ── GOOGLE AUTH ──
exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential is required.' });
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Could not get email from Google.' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists — update provider to google if it was local (merge accounts)
      if (user.provider === 'local') {
        user.provider = 'google';
      }
      // Update photo from Google if not already set
      if (!user.photo && picture) {
        user.photo = picture;
      }
      await user.save();
    } else {
      const userCount = await User.countDocuments();
      const role = userCount === 0 ? 'admin' : 'user';

      // Create new user with Google provider
      user = await User.create({
        name,
        email,
        photo: picture || '',
        provider: 'google',
        role,
      });
    }

    await sendTokenResponse(user, 200, res, true);
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ success: false, message: 'Google authentication failed. Please try again.' });
  }
};
