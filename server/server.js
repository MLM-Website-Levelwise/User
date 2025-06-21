require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://db.cmkpehljymbmlsyvpolw.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'your-supabase-key';
const supabase = createClient(supabaseUrl, supabaseKey);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register endpoint
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const { data: existingUser, error: lookupError } = await supabase
      .from('admin')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const { data: newUser, error: insertError } = await supabase
      .from('admin')
      .insert([
        { 
          email, 
          password_hash: passwordHash 
        }
      ])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email
      },
      token
    });
  if (insertError) {
      console.error('Supabase insert error:', insertError);
      throw insertError;
    }
  } catch (error) {
    console.error('Detailed registration error:', {
      message: error.message,
      code: error.code,
      details: error.details
    });
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message // Send this only in development
    });
  }
});

app.get('/test-supabase', async (req, res) => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('admin').select('*').limit(1);
    
    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        code: error.code,
        details: error.details
      });
      throw error;
    }
    
    console.log('Supabase connection successful');
    res.json({ success: true, data });
  } catch (error) {
    console.error('Full test error:', error);
    res.status(500).json({ 
      error: 'Supabase test failed',
      details: error.message 
    });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Case-insensitive email search
    const { data: user, error: userError } = await supabase
      .from('admin')
      .select('*')
      .ilike('email', email)  // Changed from .eq to .ilike for case-insensitive
      .single();

    if (userError || !user) {
      console.error('User lookup error:', userError);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await supabase
      .from('admin')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add this endpoint to your existing server code
app.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { first_name, last_name, phone, address } = req.body;

    // Validate input
    if (!first_name || !last_name) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }

    // Update profile
    const { data: updatedUser, error } = await supabase
      .from('admin')
      .update({ 
        first_name,
        last_name,
        phone,
        address,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Update this existing endpoint to include profile fields
app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: user, error } = await supabase
      .from('admin')
      .select('id, email, first_name, last_name, phone, address, created_at, last_login')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = user;
    next();
  });
}

// Add new member (updated with position field)
app.post('/members', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      phone_number,
      email,
      sponsor_code,
      sponsor_name,
      package,
      password,
      position // Add position field
    } = req.body;

    // Validate required fields
    if (!name || !phone_number || !sponsor_code || !sponsor_name || !package || !password || !position) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate unique member ID
    const member_id = Math.floor(100000 + Math.random() * 900000).toString();

    // Create new member (status defaults to inactive)
    const { data: newMember, error } = await supabase
      .from('members')
      .insert([{
        member_id,
        name,
        phone_number,
        email: email || null,
        sponsor_code,
        sponsor_name,
        package,
        password,
        position, // Include position in insert
        active_status: false
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Member added successfully',
      member: newMember
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ error: 'Failed to add member' });
  }
});

// Update member details (updated with position field)
app.put('/members/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      phone_number,
      email,
      sponsor_code,
      sponsor_name,
      package,
      password,
      date_of_joining,
      position // Add position field
    } = req.body;

    // Validate required fields
    if (!name || !phone_number || !sponsor_code || !sponsor_name || !package || !password || !date_of_joining || !position) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: updatedMember, error } = await supabase
      .from('members')
      .update({
        name,
        phone_number,
        email: email || null,
        sponsor_code,
        sponsor_name,
        package,
        password,
        date_of_joining,
        position, // Include position in update
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Member updated successfully',
      member: updatedMember
    });
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ error: 'Failed to update member' });
  }
});

app.get('/members', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', member_id, sponsor_code } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('members')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (member_id) {
      query = query.eq('member_id', member_id);
    } else if (sponsor_code) {
      query = query.eq('sponsor_code', sponsor_code);
    } else if (search) {
      query = query.or(
        `name.ilike.%${search}%,member_id.ilike.%${search}%,phone_number.ilike.%${search}%`
      );
    }

    const { data: members, error, count } = await query;

    if (error) throw error;

    res.json({
      members,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Get direct members with pagination (updated to include position)
app.get('/direct-members', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('members')
      .select('id, member_id, name, phone_number, email, sponsor_code, sponsor_name, package, active_status, date_of_joining, created_at, position', 
        { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,member_id.ilike.%${search}%,phone_number.ilike.%${search}%`
      );
    }

    const { data: members, error, count } = await query;

    if (error) throw error;

    const formattedMembers = members.map(member => ({
      ...member,
      sponsor_id: member.sponsor_code,
      position: member.position || 'Left' // Use actual position from DB
    }));

    res.json({
      members: formattedMembers,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Get direct members error:', error);
    res.status(500).json({ error: 'Failed to fetch direct members' });
  }
});

// Helper function to determine position (implement your business logic)
function determinePosition(member) {
  // Example logic - replace with your actual business rules
  return Math.random() > 0.5 ? "Left" : "Right";
}

// Get admin-referred members with pagination
// Get admin-referred members with pagination (updated to include position)
app.get('/admin-referred-members', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('members')
      .select('id, member_id, name, phone_number, email, sponsor_code, sponsor_name, package, active_status, date_of_joining, created_at, position', 
        { count: 'exact' })
      .or('sponsor_name.ilike.%admin%,sponsor_code.ilike.%admin%')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,member_id.ilike.%${search}%,phone_number.ilike.%${search}%`
      );
    }

    const { data: members, error, count } = await query;

    if (error) throw error;

    const formattedMembers = members.map(member => ({
      ...member,
      sponsor_id: member.sponsor_code,
      position: member.position || 'Left' // Use actual position from DB
    }));

    res.json({
      members: formattedMembers,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Get admin-referred members error:', error);
    res.status(500).json({ error: 'Failed to fetch admin-referred members' });
  }
});


// Update member status
app.patch('/members/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { active_status } = req.body;

    // Validate input
    if (typeof active_status !== 'boolean') {
      return res.status(400).json({ error: 'Active status must be a boolean' });
    }

    // Update member status
    const { data: updatedMember, error } = await supabase
      .from('members')
      .update({
        active_status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update status error:', error);
      throw error;
    }

    if (!updatedMember) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json({
      message: 'Member status updated successfully',
      member: updatedMember
    });
  } catch (error) {
    console.error('Update member status error:', error);
    res.status(500).json({ error: 'Failed to update member status' });
  }
});



// Member login endpoint
app.post('/member-login', async (req, res) => {
  try {
    const { member_id, password } = req.body;

    if (!member_id || !password) {
      return res.status(400).json({ error: 'Member ID and password are required' });
    }

    // Find member by member_id
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('*')
      .eq('member_id', member_id)
      .single();

    if (memberError || !member) {
      console.error('Member lookup error:', memberError);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password (plain text comparison as shown in your DB)
    if (password !== member.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ memberId: member.id, member_id: member.member_id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      member: {
        id: member.id,
        member_id: member.member_id,
        name: member.name,
        sponsor_code: member.sponsor_code,
        package: member.package
      },
      token
    });
  } catch (error) {
    console.error('Member login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get member details endpoint
app.get('/member-details', authenticateToken, async (req, res) => {
  try {
    const memberId = req.user.memberId; // From JWT token

    const { data: member, error } = await supabase
      .from('members')
      .select('id, member_id, name, sponsor_code, package')
      .eq('id', memberId)
      .single();

    if (error || !member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    console.error('Member details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Recursive function to count downline members
async function countDownline(memberId, count = 0) {
  // First get all direct referrals of this member
  const { data: directMembers, error } = await supabase
    .from('members')
    .select('id, member_id')
    .eq('sponsor_code', memberId);

  if (error || !directMembers) return count;

  // Add direct members to count
  count += directMembers.length;

  // Recursively count downline for each direct member
  for (const member of directMembers) {
    count = await countDownline(member.member_id, count);
  }

  return count;
}

// Updated member-dashboard endpoint
app.get('/member-dashboard', authenticateToken, async (req, res) => {
  try {
    const memberId = req.user.memberId;
    const memberIdStr = req.user.member_id; // Make sure this is in your JWT

    // 1. Get basic member info
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('id, member_id, name, active_status, package, sponsor_code')
      .eq('id', memberId)
      .single();

    if (memberError || !member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // 2. Get sponsor count (direct referrals)
    const { count: sponsorCount } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true })
      .eq('sponsor_code', member.member_id);

    // 3. Get downline count (recursive)
    const downlineCount = await countDownline(member.member_id);

    // 4. Get business volumes (simplified example)
    const leftBusiness = 1250;
    const rightBusiness = 1250;

    res.json({
      member: {
        id: member.id,
        member_id: member.member_id,
        name: member.name,
        status: member.active_status ? 'ACTIVE' : 'INACTIVE',
        package: member.package,
        sponsor_code: member.sponsor_code
      },
      counts: {
        sponsor: sponsorCount || 0,
        downline: downlineCount || 0
      },
      business: {
        left: leftBusiness,
        right: rightBusiness,
        difference: Math.abs(leftBusiness - rightBusiness)
      },
      investments: {
        self: 1250,
        team: 2500
      },
      balances: {
        fund: 0,
        working: 28.2,
        prev_working: 0
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get level-wise team data
app.get('/level-wise-team', authenticateToken, async (req, res) => {
  try {
    const memberId = req.user.memberId;
    const memberIdStr = req.user.member_id;

    // First get the logged-in member's details
    const { data: currentMember, error: memberError } = await supabase
      .from('members')
      .select('id, member_id, name')
      .eq('id', memberId)
      .single();

    if (memberError || !currentMember) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Recursive function to get all downline members with levels
    async function getDownlineMembers(sponsorId, currentLevel = 1, maxLevel = 6) {
      if (currentLevel > maxLevel) return [];

      const { data: directMembers, error } = await supabase
        .from('members')
        .select('id, member_id, name, sponsor_code, sponsor_name, date_of_joining, active_status')
        .eq('sponsor_code', sponsorId);

      if (error || !directMembers) return [];

      let members = [];
      for (const member of directMembers) {
        const memberWithLevel = {
          ...member,
          level: currentLevel,
          doj: member.date_of_joining,
          status: member.active_status ? 'Active' : 'InActive'
        };
        members.push(memberWithLevel);
        
        // Recursively get their downline
        const downline = await getDownlineMembers(member.member_id, currentLevel + 1, maxLevel);
        members = members.concat(downline);
      }

      return members;
    }

    // Get all downline members up to 6 levels deep
    const downlineMembers = await getDownlineMembers(currentMember.member_id);

    res.json({
      currentMember: {
        id: currentMember.id,
        member_id: currentMember.member_id,
        name: currentMember.name,
        level: 0,
        status: 'Active'
      },
      teamMembers: downlineMembers
    });
  } catch (error) {
    console.error('Level team error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/my-member', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // For admin
    const memberId = req.user.memberId; // For members
    
    // Get the current user's member ID (either admin or member)
    let rootMemberId;
    
    if (memberId) {
      // If logged in as member, get their member ID
      const { data: member, error } = await supabase
        .from('members')
        .select('member_id')
        .eq('id', memberId)
        .single();
      
      if (error || !member) {
        return res.status(404).json({ error: 'Member not found' });
      }
      rootMemberId = member.member_id;
    } else if (userId) {
      // If logged in as admin, get all members
      rootMemberId = null;
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Recursive function to get all downline members
    async function getDownlineMembers(sponsorId) {
      // Get direct referrals
      const { data: directMembers, error } = await supabase
        .from('members')
        .select('id, member_id, name, sponsor_code, sponsor_name, package, date_of_joining, active_status, position')
        .eq('sponsor_code', sponsorId);

      if (error || !directMembers) return [];

      let allMembers = [...directMembers];
      
      // Recursively get downline for each direct member
      for (const member of directMembers) {
        const downline = await getDownlineMembers(member.member_id);
        allMembers = allMembers.concat(downline);
      }

      return allMembers;
    }

    // Get all members (either all for admin or downline for member)
    let members;
    if (rootMemberId) {
      // Get the downline for a member (including the member themselves)
      members = await getDownlineMembers(rootMemberId);
      // Add the root member if not already included
      const { data: rootMember, error: rootError } = await supabase
        .from('members')
        .select('id, member_id, name, sponsor_code, sponsor_name, package, date_of_joining, active_status, position')
        .eq('member_id', rootMemberId)
        .single();
      if (!rootError && rootMember) {
        members = [rootMember, ...members.filter(m => m.member_id !== rootMemberId)];
      }
    } else {
      // Admin gets all members
      const { data: allMembers, error } = await supabase
        .from('members')
        .select('id, member_id, name, sponsor_code, sponsor_name, package, date_of_joining, active_status, position');
      
      if (error) throw error;
      members = allMembers;
    }

    res.json({
      members,
      total: members.length
    });
  } catch (error) {
    console.error('Get my member error:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Add this new endpoint to your existing server code
app.get('/direct-referrals', authenticateToken, async (req, res) => {
  try {
    const memberId = req.user.memberId; // From JWT token

    // Get the logged-in member's member_id
    const { data: currentMember, error: memberError } = await supabase
      .from('members')
      .select('member_id')
      .eq('id', memberId)
      .single();

    if (memberError || !currentMember) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const sponsorCode = currentMember.member_id;

    // Fetch only direct referrals
    const { data: directMembers, error, count } = await supabase
      .from('members')
      .select('id, member_id, name, sponsor_code, package, date_of_joining, active_status, position')
      .eq('sponsor_code', sponsorCode);

    if (error) throw error;

    // Format the response to match the required fields
    const formattedMembers = directMembers.map(member => ({
      member_id: member.member_id,
      member_name: member.name,
      position: member.position || 'N/A', // Default to 'N/A' if not set
      date_of_joining: member.date_of_joining,
      topup_date: null, // Not in schema, set to null for now
      topup_amount: null, // Not in schema, set to null for now
      package: member.package,
      status: member.active_status ? 'Active' : 'Inactive'
    }));

    res.json({
      members: formattedMembers,
      total: count || 0
    });
  } catch (error) {
    console.error('Get direct referrals error:', error);
    res.status(500).json({ error: 'Failed to fetch direct referrals' });
  }
});


//funds
app.post('/wallet-transfer', authenticateToken, async (req, res) => {
  try {
    const { member_id, transfer_type, amount } = req.body;
    const adminId = req.user.userId; // This is a UUID

    // No need to parse as integer - keep as UUID string
    const { data: admin, error: adminError } = await supabase
      .from('admin')
      .select('email')
      .eq('id', adminId)
      .single();

    if (adminError) throw adminError;

    const { data: transaction, error: transactionError } = await supabase
      .from('wallet_transactions')
      .insert({
        member_id,
        transaction_type: transfer_type,
        amount: parseFloat(amount),
        initiated_by: 'admin',
        initiator_id: adminId, // Store as UUID
        initiator_email: admin.email
      })
      .select()
      .single();

    if (transactionError) throw transactionError;

    res.json({
      message: 'Wallet transfer successful',
      transaction
    });
  } catch (error) {
    console.error('Wallet transfer error:', error);
    res.status(500).json({ error: 'Failed to process wallet transfer' });
  }
});

// Add this to your backend (server.js or similar)
app.get('/admin-wallet-transactions', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, memberId, dateFrom, dateTo, transferType } = req.query;
    const adminId = req.user.userId; // Get admin ID from token
    const offset = (page - 1) * limit;

    let query = supabase
      .from('wallet_transactions')
      .select(`
        id,
        member_id,
        members!inner(name),
        amount,
        transaction_date,
        transaction_type,
        notes,
        initiator_email
      `, { count: 'exact' })
      .eq('initiator_id', adminId) // Only show transactions initiated by this admin
      .order('transaction_date', { ascending: false })
      .range(offset, offset + limit - 1);

    // Add additional filters
    if (memberId) {
      query = query.ilike('member_id', `%${memberId}%`);
    }
    if (dateFrom) {
      query = query.gte('transaction_date', dateFrom);
    }
    if (dateTo) {
      query = query.lte('transaction_date', `${dateTo}T23:59:59`);
    }
    if (transferType) {
      query = query.eq('transaction_type', transferType);
    }

    const { data: transactions, error, count } = await query;

    if (error) throw error;

    // Format the response
    const formattedTransactions = transactions.map(txn => ({
      id: txn.id,
      memberId: txn.member_id,
      memberName: txn.members.name,
      amount: txn.amount,
      date: txn.transaction_date,
      transferType: txn.transaction_type === 'main' ? 'Main Wallet' : 'Re Top-up Wallet',
      status: 'Success',
      notes: txn.notes,
      initiatorEmail: txn.initiator_email
    }));

    res.json({
      transactions: formattedTransactions,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Error fetching admin wallet transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Add this to your backend (server.js or similar)
app.put('/update-wallet-transaction', authenticateToken, async (req, res) => {
  try {
    const { transactionId, newAmount, adjustmentType, notes } = req.body;
    const adminId = req.user.userId; // Get admin ID from token

    // Validate input
    if (!transactionId || newAmount === undefined || !adjustmentType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // First verify the transaction belongs to this admin
    const { data: originalTransaction, error: fetchError } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('id', transactionId)
      .eq('initiator_id', adminId)
      .single();

    if (fetchError || !originalTransaction) {
      return res.status(404).json({ error: 'Transaction not found or unauthorized' });
    }

    // Update the transaction
    const { data: updatedTransaction, error: updateError } = await supabase
      .from('wallet_transactions')
      .update({
        amount: parseFloat(newAmount),
        notes: notes || `Amount ${adjustmentType}ed by admin (${originalTransaction.initiator_email})`
      })
      .eq('id', transactionId)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({
      message: 'Transaction updated successfully',
      transaction: updatedTransaction
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});