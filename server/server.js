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


//Tree for member
// New endpoint for team structure
// Updated team-structure endpoint with strict binary placement
app.get('/team-structure', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.member_id;
    const { levels = 3, root_id } = req.query;
    
    const rootId = root_id || userId;

    // Get the root member
    const { data: rootMember, error: rootError } = await supabase
      .from('members')
      .select('*')
      .eq('member_id', rootId)
      .single();

    if (rootError || !rootMember) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Get all members under this root (up to specified levels)
    const { data: allMembers, error: membersError } = await supabase
      .from('members')
      .select('*')
      .neq('member_id', rootId);

    if (membersError) throw membersError;

    // Create a map for quick lookup
    const memberMap = new Map();
    memberMap.set(rootId, { ...rootMember, left: null, right: null, level: 0 });

    // First pass: initialize all members
    allMembers.forEach(member => {
      memberMap.set(member.member_id, {
        ...member,
        left: null,
        right: null,
        level: -1 // To be determined
      });
    });

    // Second pass: build binary tree structure
    const queue = [];
    queue.push(rootId);

    while (queue.length > 0) {
      const currentId = queue.shift();
      const currentNode = memberMap.get(currentId);

      // Get direct referrals sorted by joining date
      const directReferrals = allMembers
        .filter(m => m.sponsor_code === currentId)
        .sort((a, b) => new Date(a.date_of_joining) - new Date(b.date_of_joining));

      // Place first two direct referrals (if exist)
      if (directReferrals.length > 0) {
        const leftChild = directReferrals[0];
        currentNode.left = leftChild.member_id;
        memberMap.get(leftChild.member_id).level = currentNode.level + 1;
        memberMap.get(leftChild.member_id).position = 'Left';
        queue.push(leftChild.member_id);
      }

      if (directReferrals.length > 1) {
        const rightChild = directReferrals[1];
        currentNode.right = rightChild.member_id;
        memberMap.get(rightChild.member_id).level = currentNode.level + 1;
        memberMap.get(rightChild.member_id).position = 'Right';
        queue.push(rightChild.member_id);
      }

      // Handle spillover for remaining referrals (3rd+)
      for (let i = 2; i < directReferrals.length; i++) {
        const referral = directReferrals[i];
        let placed = false;
        
        // Find next available spot in the tree (BFS)
        const tempQueue = [...queue];
        while (tempQueue.length > 0 && !placed) {
          const potentialParentId = tempQueue.shift();
          const potentialParent = memberMap.get(potentialParentId);

          if (!potentialParent.left) {
            potentialParent.left = referral.member_id;
            memberMap.get(referral.member_id).level = potentialParent.level + 1;
            memberMap.get(referral.member_id).position = 'Left';
            queue.push(referral.member_id);
            placed = true;
          } else if (!potentialParent.right) {
            potentialParent.right = referral.member_id;
            memberMap.get(referral.member_id).level = potentialParent.level + 1;
            memberMap.get(referral.member_id).position = 'Right';
            queue.push(referral.member_id);
            placed = true;
          }
        }

        if (!placed) {
          console.warn(`Could not place member ${referral.member_id}`);
        }
      }
    }

    // Recursive function to build the response tree
    const buildTree = (memberId, currentLevel = 0) => {
      if (!memberId || currentLevel >= levels) return null;

      const member = memberMap.get(memberId);
      if (!member) return null;

      const leftChild = buildTree(member.left, currentLevel + 1);
      const rightChild = buildTree(member.right, currentLevel + 1);

      const children = [];
      if (leftChild) children.push(leftChild);
      if (rightChild) children.push(rightChild);

      return {
        ...member,
        children: children.length > 0 ? children : undefined,
        position: member.position
      };
    };

    const teamStructure = buildTree(rootId);

    res.json(teamStructure);
  } catch (error) {
    console.error('Get team structure error:', error);
    res.status(500).json({ error: 'Failed to fetch team structure' });
  }
});


// Add this new route to your backend
app.get('/members/check-sponsor', authenticateToken, async (req, res) => {
  try {
    const { member_id } = req.query;
    const currentUserMemberId = req.user.member_id;

    if (!member_id) {
      return res.status(400).json({ error: 'Member ID is required' });
    }

    // First check if the requested member is the current user
    if (member_id === currentUserMemberId) {
      const { data: member, error } = await supabase
        .from('members')
        .select('name')
        .eq('member_id', member_id)
        .single();

      if (error) throw error;
      if (!member) return res.status(404).json({ error: 'Member not found' });

      return res.json({ name: member.name });
    }

    // Check if the member exists
    const { data: targetMember, error: targetError } = await supabase
      .from('members')
      .select('name, sponsor_code')
      .eq('member_id', member_id)
      .single();

    if (targetError) throw targetError;
    if (!targetMember) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Check if the member is in current user's downline (any level)
    let isInDownline = false;
    let currentSponsor = targetMember.sponsor_code;
    
    // Traverse up the sponsorship tree to see if we reach current user
    while (currentSponsor) {
      if (currentSponsor === currentUserMemberId) {
        isInDownline = true;
        break;
      }
      
      // Get the next sponsor up the chain
      const { data: sponsor, error: sponsorError } = await supabase
        .from('members')
        .select('sponsor_code')
        .eq('member_id', currentSponsor)
        .single();
        
      if (sponsorError) throw sponsorError;
      if (!sponsor) break; // Reached top of hierarchy
      
      currentSponsor = sponsor.sponsor_code;
    }

    if (!isInDownline) {
      return res.status(403).json({ error: 'You can only view your own information or members in your downline' });
    }

    res.json({ name: targetMember.name });
  } catch (error) {
    console.error('Check sponsor error:', error);
    res.status(500).json({ error: 'Failed to fetch sponsor information' });
  }
});

// Add this endpoint to check activation status
app.get('/check-activation-status', authenticateToken, async (req, res) => {
  try {
    const memberId = req.user.member_id;
    
    const { data: member, error } = await supabase
      .from('members')
      .select('active_status, package')
      .eq('member_id', memberId)
      .single();

    if (error) throw error;
    if (!member) return res.status(404).json({ error: 'Member not found' });

    res.json({
      isActive: member.active_status,
      package: member.package
    });
  } catch (error) {
    console.error('Error checking activation:', error);
    res.status(500).json({ error: 'Failed to check activation status' });
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

app.get('/member-dashboard', authenticateToken, async (req, res) => {
  try {
    const memberId = req.user.memberId;
    const memberIdStr = req.user.member_id;

    // 1. Get basic member info
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('id, member_id, name, active_status, package, sponsor_code')
      .eq('id', memberId)
      .single();

    if (memberError || !member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // 2. Get sponsor count (direct referrals) and count active direct referrals
    const { count: sponsorCount, data: directReferrals } = await supabase
      .from('members')
      .select('*', { count: 'exact' })
      .eq('sponsor_code', member.member_id);

    // Count active direct referrals
    const activeDirectReferrals = directReferrals?.filter(ref => ref.active_status === true).length || 0;

    // 3. Get downline count (recursive) and count active downline members
    const { totalDownline, activeDownline } = await countDownlineWithActivity(member.member_id);

    // 4. Get business volumes (simplified example)
    const leftBusiness = 1250;
    const rightBusiness = 1250;

    // 5. Get latest top-up transaction
    const { data: latestTopup } = await supabase
      .from('main_balance_transactions')
      .select('transaction_date, amount, plan_type')
      .eq('activated_member_id', member.member_id)
      .ilike('transaction_type', '%activation%')
      .order('transaction_date', { ascending: false })
      .limit(1)
      .single();

    // 6. Calculate total profit sharing earnings
    const [{ data: mainInvestments }, { data: retopupInvestments }] = await Promise.all([
      supabase
        .from('main_balance_transactions')
        .select('id, transaction_date, amount')
        .eq('activated_member_id', member.member_id)
        .eq('plan_type', 'profit-sharing'),
      
      supabase
        .from('re_top_up_transactions')
        .select('id, transaction_date, amount')
        .eq('member_id', member.member_id)
        .eq('plan_type', 'profit-sharing')
    ]);

    const allInvestments = [
      ...(mainInvestments || []),
      ...(retopupInvestments || [])
    ];

    let totalProfitSharing = 0;
    const now = new Date();
    
    for (const investment of allInvestments) {
      const investmentDate = new Date(investment.transaction_date);
      let currentDate = new Date(investmentDate);
      
      // Calculate daily earnings (6% per 20 days = 0.3% per day)
      const dailyEarning = investment.amount * 0.003;
      
      // Generate earnings for each weekday (Monday-Friday)
      while (currentDate <= now) {
        const dayOfWeek = currentDate.getDay();
        
        // Only generate earnings on weekdays (1-5)
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          totalProfitSharing += dailyEarning;
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    res.json({
      member: {
        id: member.id,
        member_id: member.member_id,
        name: member.name,
        status: member.active_status ? 'ACTIVE' : 'INACTIVE',
        package: member.package,
        sponsor_code: member.sponsor_code,
        topup_info: latestTopup ? {
          date: latestTopup.transaction_date,
          amount: latestTopup.amount,
          package: latestTopup.plan_type
        } : null
      },
      counts: {
        sponsor: sponsorCount || 0,
        active_direct_referrals: activeDirectReferrals,
        downline: totalDownline || 0,
        active_members: activeDownline || 0
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
        fund: totalProfitSharing, // Updated to use calculated profit sharing
        working: 28.2,
        prev_working: 0
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function remains the same
async function countDownlineWithActivity(memberId) {
  let totalCount = 0;
  let activeCount = 0;
  const queue = [memberId];
  const seen = new Set();

  while (queue.length > 0) {
    const currentId = queue.shift();
    
    if (seen.has(currentId)) continue;
    seen.add(currentId);

    // Get all members sponsored by currentId
    const { data: downlineMembers } = await supabase
      .from('members')
      .select('member_id, active_status')
      .eq('sponsor_code', currentId);

    if (downlineMembers && downlineMembers.length > 0) {
      for (const member of downlineMembers) {
        if (!seen.has(member.member_id)) {
          queue.push(member.member_id);
          totalCount++;
          if (member.active_status) activeCount++;
        }
      }
    }
  }

  return { totalDownline: totalCount, activeDownline: activeCount };
}

// Get level income data with date filtering (without snapshots table)
app.get('/level-income', authenticateToken, async (req, res) => {
  try {
    const { date } = req.query;
    const memberId = req.user.memberId;

    // Get current member details
    const { data: currentMember, error: memberError } = await supabase
      .from('members')
      .select('id, member_id, name')
      .eq('id', memberId)
      .single();

    if (memberError || !currentMember) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Use current date if not specified
    const today = new Date().toISOString().split('T')[0];
    const selectedDate = date || today;
    
    // Block future dates
    if (selectedDate > today) {
      return res.status(400).json({ error: 'Future dates are not allowed' });
    }

    // Get all team members (up to 10 levels)
    const { data: allTeamMembers } = await supabase
      .from('members')
      .select('id, member_id, name, sponsor_code, date_of_joining, active_status');

    // Get ALL activated members (those with activation transactions)
    const { data: activationTransactions } = await supabase
      .from('main_balance_transactions')
      .select('activated_member_id')
      .ilike('transaction_type', '%activation%')
      .lte('transaction_date', `${selectedDate}T23:59:59`);

    const activatedMemberIds = new Set(
      activationTransactions?.map(txn => txn.activated_member_id) || []
    );

    // Build team structure - only include activated members
    const buildTeam = (sponsorId, currentLevel = 1, maxLevel = 10) => {
      if (currentLevel > maxLevel) return [];
      
      // Get direct members who are activated
      const directMembers = allTeamMembers.filter(m => 
        m.sponsor_code === sponsorId && 
        activatedMemberIds.has(m.member_id)
      );
      
      let members = [];

      for (const member of directMembers) {
        members.push({
          ...member,
          level: currentLevel
        });
        
        // Recursively add downline members
        members = members.concat(buildTeam(member.member_id, currentLevel + 1, maxLevel));
      }

      return members;
    };

    const teamMembers = buildTeam(currentMember.member_id);
    const directMembers = teamMembers.filter(m => m.level === 1).length;

    // Level configuration
    const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const percentageMap = {
      1: 20, 2: 10, 3: 10, 4: 5, 5: 5, 
      6: 3, 7: 3, 8: 3, 9: 3, 10: 3
    };

    // Get ALL business data up to selected date for cumulative calculations
    const { data: cumulativeBusinessData } = await supabase
      .from('main_balance_transactions')
      .select('activated_member_id, amount')
      .eq('plan_type', 'profit-sharing')
      .lte('transaction_date', `${selectedDate}T23:59:59`);

    const { data: cumulativeRetopupBusiness } = await supabase
      .from('re_top_up_transactions')
      .select('member_id, amount')
      .eq('plan_type', 'profit-sharing')
      .lte('transaction_date', `${selectedDate}T23:59:59`);

    // Get business data for just the selected date
    const { data: dailyBusinessData } = await supabase
      .from('main_balance_transactions')
      .select('activated_member_id, amount')
      .eq('plan_type', 'profit-sharing')
      .gte('transaction_date', `${selectedDate}T00:00:00`)
      .lte('transaction_date', `${selectedDate}T23:59:59`);

    const { data: dailyRetopupBusiness } = await supabase
      .from('re_top_up_transactions')
      .select('member_id, amount')
      .eq('plan_type', 'profit-sharing')
      .gte('transaction_date', `${selectedDate}T00:00:00`)
      .lte('transaction_date', `${selectedDate}T23:59:59`);

    // Create business maps
    const cumulativeBusinessMap = new Map();
    [...(cumulativeBusinessData || []), ...(cumulativeRetopupBusiness || [])].forEach(txn => {
      const memberId = txn.activated_member_id || txn.member_id;
      cumulativeBusinessMap.set(memberId, (cumulativeBusinessMap.get(memberId) || 0) + txn.amount);
    });

    const dailyBusinessMap = new Map();
    [...(dailyBusinessData || []), ...(dailyRetopupBusiness || [])].forEach(txn => {
      const memberId = txn.activated_member_id || txn.member_id;
      dailyBusinessMap.set(memberId, (dailyBusinessMap.get(memberId) || 0) + txn.amount);
    });

    // Calculate income data
    const incomeData = levels.map(level => {
      const levelMembers = teamMembers.filter(m => m.level === level);
      const totalMembers = levelMembers.length;
      
      // Total Profit Bonus (0.3% of cumulative business up to selected date)
      const totalProfitBonus = levelMembers.reduce((sum, member) => {
        return sum + (cumulativeBusinessMap.get(member.member_id) || 0);
      }, 0) * 0.003;
      
      const eligible = directMembers >= level;
      
      // Daily Profit Bonus (0.3% of just this day's business)
      const dailyProfitBonus = levelMembers.reduce((sum, member) => {
        return sum + (dailyBusinessMap.get(member.member_id) || 0);
      }, 0) * 0.003;
      
      // Commission = Total Profit Bonus * percentage%
      const commission = eligible ? totalProfitBonus * (percentageMap[level] / 100) : 0;
      
      // Today's Commission = Daily Profit Bonus * percentage%
      const todaysCommission = eligible ? dailyProfitBonus * (percentageMap[level] / 100) : 0;
      
      return {
        level,
        date: selectedDate,
        totalMembers, // Only activated members count
        totalProfitBonus,
        percentage: `${percentageMap[level]}%`,
        commission,
        todaysCommission,
        criteria: eligible ? 'Eligible' : 'Not eligible'
      };
    });

    

    // Calculate summaries
    const activeLevels = incomeData.filter(i => i.totalMembers > 0).length;
    const todaysIncome = incomeData.reduce((sum, i) => sum + i.commission, 0);
    // Calculate total income by simulating all previous days' commissions
let totalIncome = 0;

// 1. First calculate for all previous dates
if (date) { // Only if a specific date is selected
  const previousDaysIncome = await calculatePreviousDaysIncome(
    currentMember.member_id, 
    selectedDate,
    teamMembers,
    levels,
    percentageMap
  );
  totalIncome += previousDaysIncome;
}

// 2. Then add today's commissions
const todaysCommissions = incomeData.reduce((sum, i) => sum + i.commission, 0);
totalIncome += todaysCommissions;

// Helper function to calculate previous days' income
async function calculatePreviousDaysIncome(memberId, endDate, teamMembers, levels, percentageMap) {
  const { data: memberData } = await supabase
    .from('members')
    .select('created_at')
    .eq('member_id', memberId)
    .single();

  if (!memberData) return 0;

  const startDate = new Date(memberData.created_at);
  const cutoffDate = new Date(endDate);
  let currentDate = new Date(startDate);
  
  let cumulativeIncome = 0;
  const processedDates = new Set();
  const weekendHold = [];
  let lastValidCommission = 0; // Track the last valid commission amount

  while (currentDate <= cutoffDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayOfWeek = currentDate.getDay();

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Process any held weekend transactions first
      while (weekendHold.length > 0) {
        const weekendDate = weekendHold.shift();
        if (!processedDates.has(weekendDate)) {
          const weekendCommission = await calculateDailyCommission(weekendDate, lastValidCommission);
          cumulativeIncome += weekendCommission;
          if (weekendCommission > 0) lastValidCommission = weekendCommission;
        }
      }
      
      // Process current weekday
      const dailyCommission = await calculateDailyCommission(dateStr, lastValidCommission);
      cumulativeIncome += dailyCommission;
      if (dailyCommission > 0) lastValidCommission = dailyCommission;
    } 
    else {
      weekendHold.push(dateStr);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Process remaining held weekends
  while (weekendHold.length > 0) {
    const weekendDate = weekendHold.shift();
    if (!processedDates.has(weekendDate)) {
      const weekendCommission = await calculateDailyCommission(weekendDate, lastValidCommission);
      cumulativeIncome += weekendCommission;
    }
  }

  async function calculateDailyCommission(dateStr, fallbackCommission) {
    if (processedDates.has(dateStr)) return 0;
    processedDates.add(dateStr);

    const { data: dailyBusiness } = await supabase
      .from('main_balance_transactions')
      .select('activated_member_id, amount')
      .eq('plan_type', 'profit-sharing')
      .gte('transaction_date', `${dateStr}T00:00:00`)
      .lte('transaction_date', `${dateStr}T23:59:59`);

    const directMembers = teamMembers.filter(m => m.level === 1).length;
    let dailyCommissions = levels.reduce((sum, level) => {
      if (directMembers < level) return sum;
      
      const levelMembers = teamMembers.filter(m => m.level === level);
      const dailyProfit = levelMembers.reduce((total, member) => {
        const memberBusiness = dailyBusiness?.find(b => 
          b.activated_member_id === member.member_id
        );
        return total + (memberBusiness?.amount || 0);
      }, 0) * 0.003;

      return sum + (dailyProfit * (percentageMap[level] / 100));
    }, 0);

    // Use fallback if no transactions but team structure exists
    if (dailyCommissions === 0 && teamMembers.length > 0) {
      dailyCommissions = fallbackCommission;
    }

    return dailyCommissions;
  }

  return cumulativeIncome;
}
    res.json({
      date: selectedDate,
      directMembers, // Only activated direct members count
      incomeData,
      summary: {
        totalIncome,
        todaysIncome,
        activeLevels,
        directMembers
      }
    });

  } catch (error) {
    console.error('Level income error:', error);
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

    // Recursive function to get all downline members with levels and top-up data
    async function getDownlineMembers(sponsorId, currentLevel = 1, maxLevel = 6) {
      if (currentLevel > maxLevel) return [];

      const { data: directMembers, error } = await supabase
        .from('members')
        .select('id, member_id, name, sponsor_code, sponsor_name, date_of_joining, active_status')
        .eq('sponsor_code', sponsorId);

      if (error || !directMembers) return [];

      // Get member IDs for fetching top-up data
      const memberIds = directMembers.map(m => m.member_id);

      // Fetch latest top-up for each member
      const { data: topUpData, error: topUpError } = await supabase
        .from('main_balance_transactions')
        .select('activated_member_id, transaction_date, amount')
        .in('activated_member_id', memberIds)
        .ilike('transaction_type', '%activation%')
        .order('transaction_date', { ascending: false });

      // Get profit-sharing business - MAIN TABLE uses activated_member_id
      const { data: mainBusiness } = await supabase
        .from('main_balance_transactions')
        .select('activated_member_id, amount')
        .in('activated_member_id', memberIds)
        .eq('plan_type', 'profit-sharing');

      // RE-TOPUP TABLE uses member_id
      const { data: retopupBusiness } = await supabase
        .from('re_top_up_transactions')
        .select('member_id, amount')
        .in('member_id', memberIds)
        .eq('plan_type', 'profit-sharing');

      // NEW: Fetch all re-topup amounts for each member
      const { data: allRetopups } = await supabase
        .from('re_top_up_transactions')
        .select('member_id, amount')
        .in('member_id', memberIds);

      // Calculate total re-topup per member
      const retopupMap = new Map();
      allRetopups?.forEach(txn => {
        retopupMap.set(txn.member_id, (retopupMap.get(txn.member_id) || 0) + txn.amount);
      });

      // Calculate total business per member
      const businessMap = new Map();
      
      // Process main balance transactions (activated_member_id)
      mainBusiness?.forEach(txn => {
        businessMap.set(txn.activated_member_id, (businessMap.get(txn.activated_member_id) || 0) + txn.amount);
      });
      
      // Process re-topup transactions (member_id)
      retopupBusiness?.forEach(txn => {
        businessMap.set(txn.member_id, (businessMap.get(txn.member_id) || 0) + txn.amount);
      });

      // Create top-up map
      const topUpMap = new Map();
      topUpData?.forEach(txn => {
        if (!topUpMap.has(txn.activated_member_id)) {
          topUpMap.set(txn.activated_member_id, {
            topup_date: txn.transaction_date,
            topup_amount: txn.amount
          });
        }
      });

      let members = [];
      for (const member of directMembers) {
        const topUpInfo = topUpMap.get(member.member_id) || {};
        
        // Get business from both sources without double-counting
        const mainBusinessAmount = mainBusiness
          ?.filter(t => t.activated_member_id === member.member_id)
          .reduce((sum, t) => sum + t.amount, 0) || 0;
          
        const retopupBusinessAmount = retopupBusiness
          ?.filter(t => t.member_id === member.member_id)
          .reduce((sum, t) => sum + t.amount, 0) || 0;
        
        const totalBusiness = mainBusinessAmount + retopupBusinessAmount;
        
        // NEW: Get total re-topup amount for this member
        const totalRetopup = retopupMap.get(member.member_id) || 0;
        
        members.push({
          ...member,
          level: currentLevel,
          doj: member.date_of_joining,
          status: member.active_status ? 'Active' : 'InActive',
          topup_date: topUpInfo.topup_date || null,
          topup_amount: topUpInfo.topup_amount || null,
          total_business: totalBusiness,
          total_retopup: totalRetopup // NEW: Add total re-topup amount
        });
        
        // Recursively get downline
        const downline = await getDownlineMembers(member.member_id, currentLevel + 1, maxLevel);
        members = members.concat(downline);
      }

      return members;
    }

    // Get all downline members up to 6 levels deep with top-up data
    const downlineMembers = await getDownlineMembers(currentMember.member_id);

    res.json({
      currentMember: {
        id: currentMember.id,
        member_id: currentMember.member_id,
        name: currentMember.name,
        level: 0,
        status: 'Active',
        topup_date: null, // Current member doesn't have top-up in this context
        topup_amount: null,
        total_retopup: 0 // Current member's re-topup would be 0 or you can fetch if needed
      },
      teamMembers: downlineMembers
    });
  } catch (error) {
    console.error('Level team error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add this to your backend routes
app.get('/member-transactions/:memberId', authenticateToken, async (req, res) => {
  try {
    const { memberId } = req.params;

    // Fetch main balance transactions (top-ups)
    const { data: mainTransactions } = await supabase
      .from('main_balance_transactions')
      .select('*')
      .or(`activated_member_id.eq.${memberId},member_id.eq.${memberId}`)
      .ilike('transaction_type', '%activation%')
      .order('transaction_date', { ascending: false });

    // Fetch re-topup transactions
    const { data: reTopupTransactions } = await supabase
      .from('re_top_up_transactions')
      .select('*')
      .eq('member_id', memberId)
      .order('transaction_date', { ascending: false });

    res.json({
      topups: mainTransactions || [],
      retopups: reTopupTransactions || []
    });
  } catch (error) {
    console.error('Error fetching member transactions:', error);
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

    // Recursive function to get all downline members with top-up data
    async function getDownlineMembers(sponsorId) {
      // Get direct referrals (only first level downline)
      const { data: directMembers, error } = await supabase
        .from('members')
        .select('id, member_id, name, sponsor_code, sponsor_name, package, date_of_joining, active_status, position')
        .eq('sponsor_code', sponsorId);

      if (error || !directMembers) return [];

      // Get member IDs for fetching top-up data
      const memberIds = directMembers.map(m => m.member_id);

      // Fetch latest top-up for each member
      const { data: topUpData, error: topUpError } = await supabase
        .from('main_balance_transactions')
        .select('activated_member_id, transaction_date, amount')
        .in('activated_member_id', memberIds)
        .ilike('transaction_type', '%activation%')
        .order('transaction_date', { ascending: false });

      if (topUpError) throw topUpError;

      // Create a map of member_id to their latest top-up
      const topUpMap = new Map();
      topUpData.forEach(transaction => {
        if (!topUpMap.has(transaction.activated_member_id)) {
          topUpMap.set(transaction.activated_member_id, {
            topup_date: transaction.transaction_date,
            topup_amount: transaction.amount
          });
        }
      });

      // Add top-up data to direct members
      let allMembers = directMembers.map(member => {
        const topUpInfo = topUpMap.get(member.member_id) || {};
        return {
          ...member,
          topup_date: topUpInfo.topup_date || null,
          topup_amount: topUpInfo.topup_amount || null
        };
      });
      
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
      // Get ONLY the downline for a member (excluding the member themselves)
      members = await getDownlineMembers(rootMemberId);
      
      // No need to add root member anymore since we only want downline
    } else {
      // Admin gets all members with top-up data
      const { data: allMembers, error } = await supabase
        .from('members')
        .select('id, member_id, name, sponsor_code, sponsor_name, package, date_of_joining, active_status, position');
      
      if (error) throw error;
      
      // Get all member IDs for top-up data
      const memberIds = allMembers.map(m => m.member_id);
      
      // Fetch top-up data for all members
      const { data: topUpData, error: topUpError } = await supabase
        .from('main_balance_transactions')
        .select('activated_member_id, transaction_date, amount')
        .in('activated_member_id', memberIds)
        .eq('transaction_type', 'member_activation')
        .order('transaction_date', { ascending: false });

      if (topUpError) throw topUpError;

      // Create a map of member_id to their latest top-up
      const topUpMap = new Map();
      topUpData.forEach(transaction => {
        if (!topUpMap.has(transaction.activated_member_id)) {
          topUpMap.set(transaction.activated_member_id, {
            topup_date: transaction.transaction_date,
            topup_amount: transaction.amount
          });
        }
      });

      // Add top-up data to all members
      members = allMembers.map(member => {
        const topUpInfo = topUpMap.get(member.member_id) || {};
        return {
          ...member,
          topup_date: topUpInfo.topup_date || null,
          topup_amount: topUpInfo.topup_amount || null
        };
      });
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

    // Fetch direct referrals
    const { data: directMembers, error: membersError } = await supabase
      .from('members')
      .select('id, member_id, name, sponsor_code, package, date_of_joining, active_status, position')
      .eq('sponsor_code', sponsorCode);

    if (membersError) throw membersError;

    // Get member IDs for fetching top-up data
    const memberIds = directMembers.map(m => m.member_id);

    // Fetch latest top-up for each member
    const { data: topUpData, error: topUpError } = await supabase
      .from('main_balance_transactions')
      .select('activated_member_id, transaction_date, amount')
      .in('activated_member_id', memberIds)
      .eq('transaction_type', 'member_activation')
      .order('transaction_date', { ascending: false });

    if (topUpError) throw topUpError;

    // Create a map of member_id to their latest top-up
    const topUpMap = new Map();
    topUpData.forEach(transaction => {
      if (!topUpMap.has(transaction.activated_member_id)) {
        topUpMap.set(transaction.activated_member_id, {
          topup_date: transaction.transaction_date,
          topup_amount: transaction.amount
        });
      }
    });

    // Format the response
    const formattedMembers = directMembers.map(member => {
      const topUpInfo = topUpMap.get(member.member_id) || {};
      
      return {
        member_id: member.member_id,
        member_name: member.name,
        position: member.position || 'N/A',
        date_of_joining: member.date_of_joining,
        topup_date: topUpInfo.topup_date || null,
        topup_amount: topUpInfo.topup_amount || null,
        package: member.package,
        status: member.active_status ? 'Active' : 'Inactive'
      };
    });

    res.json({
      members: formattedMembers,
      total: directMembers.length
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
    const adminId = req.user.userId;
    const transferAmount = parseFloat(amount);

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
        amount: transferAmount,
        original_amount: transferAmount, // Store original amount
        initiated_by: 'admin',
        initiator_id: adminId,
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
    const adminId = req.user.userId;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('wallet_transactions')
      .select(`
        id,
        member_id,
        members!inner(name),
        amount,
        original_amount,
        transaction_date,
        transaction_type,
        notes,
        initiator_email
      `, { count: 'exact' })
      .eq('initiator_id', adminId)
      .order('transaction_date', { ascending: false })
      .range(offset, offset + limit - 1);

    // Add filters...
    
    const { data: transactions, error, count } = await query;

    if (error) throw error;

    const formattedTransactions = transactions.map(txn => ({
      id: txn.id,
      memberId: txn.member_id,
      memberName: txn.members.name,
      amount: txn.amount,
      original_amount: txn.original_amount || txn.amount, // Use original_amount if exists, otherwise use amount
      date: txn.transaction_date,
      transferType: txn.transaction_type === 'Main Wallet' ? 'Main Wallet' : 'Re Top-up Wallet',
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
    const { transactionId, newAmount, adjustmentType, notes, newOriginalAmount } = req.body;
    const adminId = req.user.userId;

    // Validate input
    if (!transactionId || newAmount === undefined || !adjustmentType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get the original transaction
    const { data: originalTransaction, error: fetchError } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('id', transactionId)
      .eq('initiator_id', adminId)
      .single();

    if (fetchError || !originalTransaction) {
      return res.status(404).json({ error: 'Transaction not found or unauthorized' });
    }

    // Prepare update data
    const updateData = {
      amount: parseFloat(newAmount),
      notes: notes || `Amount ${adjustmentType}ed by admin (${originalTransaction.initiator_email})`,
      updated_at: new Date().toISOString(),
      original_amount: parseFloat(newOriginalAmount) // Use the calculated original amount from frontend
    };

    // Update the transaction
    const { data: updatedTransaction, error: updateError } = await supabase
      .from('wallet_transactions')
      .update(updateData)
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


//Member wallet
// In your /member-wallet-balance endpoint:
app.get('/member-wallet-balance', authenticateToken, async (req, res) => {
  try {
    const { member_id } = req.query;
    
    if (!member_id) {
      return res.status(400).json({ error: 'member_id is required' });
    }

    // ONLY fetch Main Wallet transactions (exact match)
    const { data: transactions, error } = await supabase
      .from('wallet_transactions')
      .select('amount')
      .eq('member_id', member_id)
      .eq('transaction_type', 'Main Wallet'); // Exact string match

    if (error) throw error;

    const balance = transactions.reduce((sum, txn) => sum + Number(txn.amount), 0);
    
    res.json({ 
      success: true,
      balance: balance,
      transactions: transactions
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch balance'
    });
  }
});

// Handle self activation
app.post('/self-activate', authenticateToken, async (req, res) => {
  try {
    const memberId = req.user.member_id;
    const { planType, packageName, amount } = req.body;

    // 1. Get member details (for name)
    const { data: member, error: memberFetchError } = await supabase
      .from('members')
      .select('member_id, name')
      .eq('member_id', memberId)
      .single();

    if (memberFetchError || !member) {
      throw new Error('Member not found');
    }

    // 2. Find latest Main Wallet transaction
    const { data: mainWallet, error: walletError } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('member_id', memberId)
      .eq('transaction_type', 'Main Wallet')
      .order('transaction_date', { ascending: false })
      .limit(1)
      .single();

    if (walletError) throw walletError;
    if (!mainWallet) throw new Error('Main Wallet not found');

    // 3. Calculate new balance
    const newBalance = Number(mainWallet.amount) - Number(amount);
    
    // 4. Update Main Wallet
    const { data: updatedWallet, error: updateError } = await supabase
      .from('wallet_transactions')
      .update({
        amount: newBalance,
        notes: `Deducted ${amount} for ${packageName || planType} activation`,
        updated_at: new Date().toISOString()
      })
      .eq('id', mainWallet.id)
      .select()
      .single();

    if (updateError) throw updateError;

    // 5. Create main_balance_transactions record (key change is here)
    const { data: balanceTransaction, error: balanceError } = await supabase
      .from('main_balance_transactions')
      .insert({
        member_id: memberId,               // Who performed the activation
        transaction_type: 'activation',    // Kept as 'activation'
        plan_type: planType === 'growth' ? packageName : planType,
        amount: amount,
        transaction_date: new Date().toISOString(),
        status: 'completed',
        notes: `Self activation for ${packageName || planType} package`,
        activated_member_id: memberId,      // Same as member_id for self-activation
        activated_member_name: member.name  // Member's own name
      })
      .select()
      .single();

    if (balanceError) throw balanceError;

    // 6. Update member status
    const { data: updatedMember, error: memberUpdateError } = await supabase
      .from('members')
      .update({
        active_status: true,
        package: planType === 'growth' ? packageName : planType,
        updated_at: new Date().toISOString()
      })
      .eq('member_id', memberId)
      .select()
      .single();

    if (memberUpdateError) throw memberUpdateError;

    res.json({
      success: true,
      newBalance,
      walletTransaction: updatedWallet,
      balanceTransaction: balanceTransaction,
      member: updatedMember
    });

  } catch (error) {
    console.error('Activation error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});


//activate member
// Add this to your backend routes
app.post('/activate-member', authenticateToken, async (req, res) => {
  try {
    const { memberId, planType, amount } = req.body;
    const activatorId = req.user.member_id.toString();

    // Input validation
    if (!memberId || !planType || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get member data
    const { data: memberData, error: memberError } = await supabase
      .from('members')
      .select('name, active_status')
      .eq('member_id', memberId)
      .single();

    if (memberError || !memberData) {
      return res.status(404).json({ error: 'Member not found' });
    }

    if (memberData.active_status) {
      return res.status(400).json({ error: 'Member already active' });
    }

    // Get activator data
    const { data: activatorData } = await supabase
      .from('members')
      .select('name')
      .eq('member_id', activatorId)
      .single();

    // Get wallet balance
    const { data: walletData } = await supabase
      .from('wallet_transactions')
      .select('amount, id')
      .eq('member_id', activatorId)
      .eq('transaction_type', 'Main Wallet')
      .order('transaction_date', { ascending: false })
      .limit(1);

    if (!walletData || walletData.length === 0) {
      return res.status(400).json({ error: 'Wallet not found' });
    }

    const currentBalance = walletData[0].amount;
    if (currentBalance < amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    // Perform all operations in a transaction
    const { error: transactionError } = await supabase
      .from('main_balance_transactions')
      .insert({
        member_id: activatorId,
        transaction_type: 'member_activation',
        plan_type: planType,
        amount: amount,
        activated_member_id: memberId,
        activated_member_name: memberData.name,
        notes: `Activated by ${activatorData.name} (${activatorId})`
      });

    if (transactionError) throw transactionError;

    // Update wallet
    const { error: walletError } = await supabase
      .from('wallet_transactions')
      .update({
        amount: currentBalance - amount,
        notes: `Deducted ${amount} for activating ${memberData.name}`,
        updated_at: new Date().toISOString()
      })
      .eq('id', walletData[0].id);

    if (walletError) throw walletError;

    // Activate member
    const { error: memberUpdateError } = await supabase
      .from('members')
      .update({
        active_status: true,
        package: planType,
        updated_at: new Date().toISOString()
      })
      .eq('member_id', memberId);

    if (memberUpdateError) throw memberUpdateError;

    res.json({
      success: true,
      newBalance: currentBalance - amount,
      activatedMember: {
        id: memberId,
        name: memberData.name,
        plan: planType
      }
    });

  } catch (error) {
    console.error('Activation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Activation failed',
      details: error.message
    });
  }
});

app.get('/topup-statement', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching topup statement for user:', req.user);
    
    // First get the current user's member_id
    const { data: currentMember, error: memberError } = await supabase
      .from('members')
      .select('member_id')
      .eq('id', req.user.memberId)
      .single();

    if (memberError || !currentMember) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const currentMemberId = currentMember.member_id;

    // Now fetch only transactions where this user is the activator
    const { data, error } = await supabase
      .from('main_balance_transactions')
      .select(`
        id,
        member_id,
        activated_member_id,
        activated_member_name,
        plan_type,
        amount,
        status,
        transaction_date
      `)
      .eq('transaction_type', 'member_activation')
      .eq('member_id', currentMemberId)  // Only transactions done by this user
      .order('transaction_date', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }

    console.log('Retrieved data count:', data?.length);

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No transactions found' });
    }

    const formattedData = data.map(item => ({
      'sl no': item.id,
      'mem id': item.activated_member_id,
      'mem name': item.activated_member_name,
      'top up date': item.transaction_date,
      'plan': item.plan_type,
      'amt': item.amount,
      'status': item.status
    }));

    res.json(formattedData);

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

//re top up
// Add to your server.js
app.post('/re-top-up', authenticateToken, async (req, res) => {
  try {
    const { memberId, planType, amount, initiatorId } = req.body;

    // ===== 1. UPDATE WALLET (SUBTRACT) =====
    // Find latest Re Top-up Wallet balance
    const { data: wallet, error: walletError } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('member_id', String(memberId))
      .eq('transaction_type', 'Re Top-up Wallet')
      .order('transaction_date', { ascending: false })
      .limit(1)
      .single();

    if (walletError) throw walletError;
    if (!wallet) throw new Error('No Re Top-up Wallet found');

    // Calculate new balance (200 - 25 = 175)
    const newWalletBalance = Number(wallet.amount) - Number(amount);

    // Update wallet transaction
    const { error: walletUpdateError } = await supabase
      .from('wallet_transactions')
      .update({
        amount: newWalletBalance,
        notes: `Re-Top Up for ${planType}`,
        transaction_date: new Date().toISOString()
      })
      .eq('id', wallet.id);

    if (walletUpdateError) throw walletUpdateError;

    // ===== 2. CREATE RE-TOP UP TRANSACTION (ADD) =====
    const { data: newTopUp, error: topUpError } = await supabase
      .from('re_top_up_transactions')
      .insert([{
        member_id: String(memberId),
        plan_type: planType,
        amount: amount,
        transaction_date: new Date().toISOString(),
        status: 'completed',
        // position: 'left' // or your business logic
      }])
      .select()
      .single();

    if (topUpError) throw topUpError;

    // ===== 3. RETURN SUCCESS =====
    res.json({
      success: true,
      walletBalance: newWalletBalance,
      topUpRecord: newTopUp
    });

  } catch (error) {
    console.error('Re-Top Up Error:', {
      message: error.message,
      code: error.code,
      details: error.details
    });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/re-top-up-wallet-balance', authenticateToken, async (req, res) => {
  try {
    const { member_id } = req.query;
    
    if (!member_id) {
      return res.status(400).json({ error: 'member_id is required' });
    }

    // Fetch ONLY Re-Top Up Wallet transactions
    const { data: transactions, error } = await supabase
      .from('wallet_transactions')
      .select('amount')
      .eq('member_id', member_id)
      .eq('transaction_type', 'Re Top-up Wallet') // Exact string match
      .order('transaction_date', { ascending: false });

    if (error) throw error;

    const balance = transactions.reduce((sum, txn) => sum + Number(txn.amount), 0);
    
    res.json({ 
      success: true,
      balance: balance,
      transactions: transactions
    });
  } catch (error) {
    console.error('Re-Top Up balance error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch Re-Top Up balance'
    });
  }
});


// Add this endpoint to your server code
app.get('/self-activation-report', authenticateToken, async (req, res) => {
  try {
    const memberId = req.user.member_id; // Get member ID from JWT token

    // 1. Get activation details from main_balance_transactions
    const { data: activations, error: activationError } = await supabase
      .from('main_balance_transactions')
      .select(`
        id,
        transaction_type,
        plan_type,
        amount,
        transaction_date,
        status,
        notes
      `)
      .eq('member_id', memberId)
      .eq('transaction_type', 'activation')
      .order('transaction_date', { ascending: false });

    if (activationError) throw activationError;

    // 2. Get re-top up transactions
    const { data: reTopups, error: reTopupError } = await supabase
      .from('re_top_up_transactions')
      .select(`
        id,
        plan_type,
        amount,
        transaction_date,
        status
      `)
      .eq('member_id', memberId)
      .order('transaction_date', { ascending: false });

    if (reTopupError) throw reTopupError;

    // 3. Combine and format the data
    const formattedActivations = activations.map(act => ({
      id: act.id,
      date: act.transaction_date,
      userId: memberId,
      transactionType: act.transaction_type,
      plan: act.plan_type,
      package: `$${act.amount}`,
      amount: act.amount,
      status: act.status,
      isReTopup: false
    }));

    const formattedReTopups = reTopups.map(topup => ({
      id: topup.id,
      date: topup.transaction_date,
      userId: memberId,
      transactionType: 'Re Topup',
      plan: topup.plan_type,
      package: `$${topup.amount}`,
      amount: topup.amount,
      status: topup.status,
      isReTopup: true
    }));

    // Combine both arrays and sort by date (newest first)
    const allTransactions = [...formattedActivations, ...formattedReTopups]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((txn, index) => ({
        ...txn,
        slNo: index + 1 // Add serial number
      }));

    res.json({
      success: true,
      transactions: allTransactions
    });

  } catch (error) {
    console.error('Self activation report error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activation report'
    });
  }
});

//Income
// Add this to your backend routes
// app.get('/profit-sharing-income', authenticateToken, async (req, res) => {
//   try {
//     const memberId = req.user.memberId;
    
//     // Get all profit-sharing investments (both main balance and re-topup)
//     const [{ data: mainInvestments }, { data: retopupInvestments }] = await Promise.all([
//       supabase
//         .from('main_balance_transactions')
//         .select('id, transaction_date, amount, status, activated_member_id as member_id')
//         .eq('activated_member_id', req.user.member_id)
//         .ilike('transaction_type', '%profit-sharing%')
//         .order('transaction_date', { ascending: true }),
      
//       supabase
//         .from('re_top_up_transactions')
//         .select('id, transaction_date, amount, status, member_id')
//         .eq('member_id', req.user.member_id)
//         .eq('plan_type', 'profit-sharing')
//         .order('transaction_date', { ascending: true })
//     ]);

//     // Combine both investment types
//     const allInvestments = [
//       ...(mainInvestments || []),
//       ...(retopupInvestments || [])
//     ];

//     // Calculate earnings for each investment
//     const earnings = [];
//     const now = new Date();
//     const totalDays = 750; // 25 months (25 * 30 days)
    
//     for (const investment of allInvestments) {
//       const investmentDate = new Date(investment.transaction_date);
//       let daysPassed = 0;
//       let totalEarnings = 0;
//       let lastPayoutDate = null;
      
//       // Calculate days passed
//       const tempDate = new Date(investmentDate);
//       while (tempDate <= now && daysPassed < totalDays) {
//         daysPassed++;
        
//         // Calculate daily earnings (6% over 25 months)
//         const dailyEarning = (investment.amount * 0.06) / totalDays;
//         totalEarnings += dailyEarning;
        
//         // Create weekly payouts (every 7 days)
//         if (daysPassed % 7 === 0) {
//           const payoutAmount = dailyEarning * 7;
//           earnings.push({
//             investmentId: investment.id,
//             payoutDate: new Date(tempDate),
//             amount: payoutAmount,
//             status: tempDate < now ? 'Paid' : 'Pending',
//             source: investment.transaction_date === investment.transaction_date ? 
//                    'Main Balance' : 'Re-Topup'
//           });
//           lastPayoutDate = new Date(tempDate);
//         }
//         tempDate.setDate(tempDate.getDate() + 1);
//       }
      
//       // Add pending earnings for incomplete weeks
//       const remainingDays = daysPassed % 7;
//       if (remainingDays > 0) {
//         const dailyEarning = (investment.amount * 0.06) / totalDays;
//         earnings.push({
//           investmentId: investment.id,
//           payoutDate: lastPayoutDate ? 
//             new Date(lastPayoutDate.setDate(lastPayoutDate.getDate() + 7)) : 
//             new Date(investmentDate.setDate(investmentDate.getDate() + 7)),
//           amount: dailyEarning * remainingDays,
//           status: 'Pending',
//           source: investment.transaction_date === investment.transaction_date ? 
//                  'Main Balance' : 'Re-Topup'
//         });
//       }
//     }

//     // Sort earnings by payout date
//     earnings.sort((a, b) => new Date(a.payoutDate) - new Date(b.payoutDate));

//     res.json(earnings);
//   } catch (error) {
//     console.error('Profit sharing income error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.get('/profit-sharing-income', authenticateToken, async (req, res) => {
//   try {
//     const memberId = req.user.member_id; // Standardized to use member_id
    
//     // Get all profit-sharing investments (both main balance and re-topup)
//     const [{ data: mainInvestments }, { data: retopupInvestments }] = await Promise.all([
//       supabase
//         .from('main_balance_transactions')
//         .select('id, transaction_date, amount, status, activated_member_id')
//         .eq('activated_member_id', memberId)
//         .ilike('transaction_type', '%profit-sharing%')
//         .order('transaction_date', { ascending: true }),
      
//       supabase
//         .from('re_top_up_transactions')
//         .select('id, transaction_date, amount, status, member_id')
//         .eq('member_id', memberId)
//         .eq('plan_type', 'profit-sharing')
//         .order('transaction_date', { ascending: true })
//     ]);

//     // Combine both investment types with source identification
//     const allInvestments = [
//       ...(mainInvestments || []).map(i => ({ ...i, source: 'Main Balance' })),
//       ...(retopupInvestments || []).map(i => ({ ...i, source: 'Re-Topup' }))
//     ];

//     // Calculate daily earnings for each investment
//     const earnings = [];
//     const now = new Date();
//     const totalDays = 750; // 25 months (25 * 30 days)
    
//     for (const investment of allInvestments) {
//       const investmentDate = new Date(investment.transaction_date);
//       let daysPassed = 0;
      
//       // Calculate daily earnings from investment date to now or completion
//       const tempDate = new Date(investmentDate);
//       while (tempDate <= now && daysPassed < totalDays) {
//         daysPassed++;
        
//         // Calculate daily earnings (6% annual return over 25 months)
//         const dailyEarning = (investment.amount * 0.06) / totalDays;
        
//         earnings.push({
//           investmentId: investment.id,
//           payoutDate: new Date(tempDate),
//           amount: dailyEarning,
//           status: tempDate < now ? 'Paid' : 'Pending',
//           source: investment.source
//         });
        
//         tempDate.setDate(tempDate.getDate() + 1);
//       }
//     }

//     // Sort earnings by payout date
//     earnings.sort((a, b) => new Date(a.payoutDate) - new Date(b.payoutDate));

//     // Transform to match frontend expectations with sequential IDs
//     const response = earnings.map((item, index) => ({
//       id: index + 1,
//       payoutDate: item.payoutDate.toISOString(),
//       profitSharingBonus: item.amount,
//       status: item.status,
//       source: item.source
//     }));

//     res.json(response);
//   } catch (error) {
//     console.error('Profit sharing income error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.get('/profit-sharing-test', authenticateToken, async (req, res) => {
//   try {
//     const memberId = req.user.member_id;
    
//     console.log(`Fetching profit sharing data for member: ${memberId}`); // Debug log
    
//     const [{ data: mainInvestments, error: mainError }, 
//            { data: retopupInvestments, error: retopupError }] = await Promise.all([
//       supabase
//         .from('main_balance_transactions')
//         .select('id, transaction_date, amount, status, activated_member_id')
//         .eq('activated_member_id', memberId)
//         .eq('plan_type', 'profit-sharing'),
      
//       supabase
//         .from('re_top_up_transactions')
//         .select('id, transaction_date, amount, status, member_id')
//         .eq('member_id', memberId)
//         .eq('plan_type', 'profit-sharing')
//     ]);

//     // Log any errors
//     if (mainError) console.error('Main balance error:', mainError);
//     if (retopupError) console.error('Re-topup error:', retopupError);

//     const allInvestments = [
//       ...(mainInvestments || []).map(i => ({ ...i, source: 'Main Balance' })),
//       ...(retopupInvestments || []).map(i => ({ ...i, source: 'Re-Topup' }))
//     ];

//     console.log(`Found ${allInvestments.length} investments`); // Debug log

//     const earnings = [];
//     const now = new Date();
    
//     for (const investment of allInvestments) {
//       const investmentDate = new Date(investment.transaction_date);
//       let currentDate = new Date(investmentDate);
      
//       // Calculate daily earnings (6% per 20 days = 0.3% per day)
//       const dailyEarning = investment.amount * 0.003;
      
//       // Generate earnings every day (Monday-Friday)
//       while (currentDate <= now) {
//         const dayOfWeek = currentDate.getDay();
        
//         // Only generate earnings on weekdays (1-5)
//         if (dayOfWeek >= 1 && dayOfWeek <= 5) {
//           earnings.push({
//             investmentId: investment.id,
//             payoutDate: new Date(currentDate),
//             amount: dailyEarning,
//             status: currentDate < now ? 'Paid' : 'Pending',
//             source: investment.source
//           });
//         }
        
//         // Move to next day (for testing, we'll use current time)
//         currentDate = new Date(currentDate.getTime() + 86400000); // 1 day
//       }
//     }

//     console.log(`Generated ${earnings.length} earnings records`); // Debug log

//     earnings.sort((a, b) => new Date(a.payoutDate) - new Date(b.payoutDate));

//     const response = earnings.map((item, index) => ({
//       id: index + 1,
//       payoutDate: item.payoutDate.toISOString(),
//       profitSharingBonus: item.amount,
//       status: item.status,
//       source: item.source
//     }));

//     res.json(response);
//   } catch (error) {
//     console.error('Test profit sharing error:', error);
//     res.status(500).json({ 
//       error: 'Internal server error',
//       details: error.message 
//     });
//   }
// });

app.get('/profit-sharing', authenticateToken, async (req, res) => {
  try {
    const memberId = req.user.member_id;
    
    console.log(`Fetching profit sharing data for member: ${memberId}`);
    
    const [{ data: mainInvestments, error: mainError }, 
           { data: retopupInvestments, error: retopupError }] = await Promise.all([
      supabase
        .from('main_balance_transactions')
        .select('id, transaction_date, amount, status, activated_member_id')
        .eq('activated_member_id', memberId)
        .eq('plan_type', 'profit-sharing'),
      
      supabase
        .from('re_top_up_transactions')
        .select('id, transaction_date, amount, status, member_id')
        .eq('member_id', memberId)
        .eq('plan_type', 'profit-sharing')
    ]);

    if (mainError) console.error('Main balance error:', mainError);
    if (retopupError) console.error('Re-topup error:', retopupError);

    const allInvestments = [
      ...(mainInvestments || []).map(i => ({ ...i, source: 'Main Balance' })),
      ...(retopupInvestments || []).map(i => ({ ...i, source: 'Re-Topup' }))
    ];

    // console.log(`Found ${allInvestments.length} investments`);

    const earnings = [];
    const now = new Date();
    
    for (const investment of allInvestments) {
      const investmentDate = new Date(investment.transaction_date);
      let currentDate = new Date(investmentDate);
      
      // Calculate daily earnings (6% per 20 days = 0.3% per day)
      const dailyEarning = investment.amount * 0.003;
      
      // Generate earnings for each weekday (Monday-Friday)
      while (currentDate <= now) {
        const dayOfWeek = currentDate.getDay();
        
        // Only generate earnings on weekdays (1-5)
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          earnings.push({
            investmentId: investment.id,
            payoutDate: new Date(currentDate),
            amount: dailyEarning,
            status: currentDate < now ? 'Paid' : 'Pending',
            source: investment.source
          });
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // console.log(`Generated ${earnings.length} earnings records`);

    earnings.sort((a, b) => new Date(a.payoutDate) - new Date(b.payoutDate));

    const response = earnings.map((item, index) => ({
      id: index + 1,
      payoutDate: item.payoutDate.toISOString(),
      profitSharingBonus: item.amount,
      status: item.status,
      source: item.source
    }));

    res.json(response);
  } catch (error) {
    console.error('Profit sharing error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});


// Test endpoint to check if investments exist
app.get('/check-profit-sharing-investments', authenticateToken, async (req, res) => {
  try {
    const memberId = req.user.member_id;
    
    const [{ data: mainInvestments }, { data: retopupInvestments }] = await Promise.all([
      supabase
        .from('main_balance_transactions')
        .select('id, amount, transaction_date')
        .eq('activated_member_id', memberId)
        .eq('plan_type', 'profit-sharing'),
      
      supabase
        .from('re_top_up_transactions')
        .select('id, amount, transaction_date')
        .eq('member_id', memberId)
        .eq('plan_type', 'profit-sharing')
    ]);

    res.json({
      mainBalanceInvestments: mainInvestments || [],
      reTopupInvestments: retopupInvestments || [],
      hasInvestments: (mainInvestments?.length || 0) + (retopupInvestments?.length || 0) > 0
    });
  } catch (error) {
    console.error('Check investments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Add this endpoint to your server.js
app.post('/process-growth-transaction', authenticateToken, async (req, res) => {
  try {
    const { member_id, transaction_type, amount, activated_member_id, activated_member_name } = req.body;

    // Validate input
    if (!member_id || !transaction_type || !amount) {
      return res.status(400).json({ error: 'Member ID, transaction type, and amount are required' });
    }

    // Check if member exists and get their sponsor
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('sponsor_code, sponsor_name, package')
      .eq('member_id', member_id)
      .single();

    if (memberError || !member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Only process for Growth package
    if (member.package !== 'growth') {
      return res.status(400).json({ error: 'Commission only applicable for Growth package' });
    }

    // Start transaction
    const { data: transactionData, error: transactionError } = await supabase
      .from('re_top_up_transactions')
      .insert([
        { 
          member_id,
          plan_type: 'growth',
          amount,
          status: 'completed'
        }
      ])
      .select()
      .single();

    if (transactionError) throw transactionError;

    // Calculate commission (10%)
    const commissionAmount = amount * 0.1;

    // If there's a sponsor, create commission transaction
    if (member.sponsor_code) {
      // Record in main balance transactions
      const { error: balanceError } = await supabase
        .from('main_balance_transactions')
        .insert([
          {
            member_id: member.sponsor_code,
            transaction_type: 'referral_commission',
            plan_type: 'growth',
            amount: commissionAmount,
            notes: `Commission from ${member_id}'s ${transaction_type}`,
            activated_member_id: activated_member_id || member_id,
            activated_member_name: activated_member_name || null
          }
        ]);

      if (balanceError) throw balanceError;

      // Update sponsor's balance (assuming you have a balance column in members table)
      const { error: updateError } = await supabase
        .from('members')
        .update({ 
          balance: supabase.rpc('increment', { 
            column: 'balance', 
            val: commissionAmount 
          }) 
        })
        .eq('member_id', member.sponsor_code);

      if (updateError) throw updateError;
    }

    res.json({
      success: true,
      message: 'Transaction processed successfully',
      transaction: transactionData,
      commission: member.sponsor_code ? {
        sponsor_id: member.sponsor_code,
        amount: commissionAmount,
        processed: true
      } : {
        processed: false,
        reason: 'No sponsor found'
      }
    });

  } catch (error) {
    console.error('Transaction processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process transaction',
      details: error.message 
    });
  }
});

// Get income data
app.get('/api/income', authenticateToken, async (req, res) => {
  try {
    const memberId = req.user.memberId;

    // Get member details
    const { data: currentMember, error: memberError } = await supabase
      .from('members')
      .select('member_id, name')
      .eq('id', memberId)
      .single();

    if (memberError || !currentMember) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Get direct referrals
    const { data: directReferrals, error: referralsError } = await supabase
      .from('members')
      .select('member_id, name')
      .eq('sponsor_code', currentMember.member_id);

    if (referralsError) throw referralsError;
    const referralIds = directReferrals.map(r => r.member_id);

    // Get re-top up transactions
    const { data: topUpData, error: topUpError } = await supabase
      .from('re_top_up_transactions')
      .select(`
        *,
        member:member_id (name)
      `)
      .in('member_id', referralIds)
      .eq('plan_type', 'growth')
      .order('transaction_date', { ascending: false });

    // Get activation commissions
    const { data: balanceData, error: balanceError } = await supabase
      .from('main_balance_transactions')
      .select(`
        *,
        activated_member:activated_member_id (name)
      `)
      .in('activated_member_id', referralIds)
      .ilike('transaction_type', '%activation%')
      .eq('plan_type', 'growth')
      .order('transaction_date', { ascending: false });

    if (topUpError || balanceError) throw topUpError || balanceError;

    // Format data for UI with proper date and all required fields
    const combinedData = [
      ...topUpData.map(t => ({
        id: t.id,
        transaction_date: new Date(t.transaction_date).toISOString(),
        member_id: t.member_id,
        name: t.member?.name || 'N/A',
        transaction_type: 'Re-top up', // Changed from 'type' to 'transaction_type'
        plan_type: t.plan_type || 'growth', // Changed from 'package' to 'plan_type'
        amount: t.amount,
        income: t.amount * 0.1,
        activated_member_name: t.member?.name || 'N/A'
      })),
      
      ...balanceData.map(t => ({
        id: t.id,
        transaction_date: new Date(t.transaction_date).toISOString(),
        member_id: t.activated_member_id,
        name: t.activated_member?.name || t.activated_member_name || 'N/A',
        transaction_type: t.transaction_type || 'member_activation', // Changed from 'type'
        plan_type: t.plan_type || 'growth', // Changed from 'package'
        amount: t.amount,
        income: t.amount * 0.1, // Commission is full amount for activations (removed *0.1)
        activated_member_name: t.activated_member?.name || t.activated_member_name || 'N/A'
      }))
    ];

    res.json(combinedData);
  } catch (error) {
    console.error('Error fetching income data:', error);
    res.status(500).json({ error: 'Failed to fetch income data' });
  }
});

// Get bank details for logged-in user
app.get('/api/bank-details', authenticateToken, async (req, res) => {
  try {
    const memberId = req.user.memberId;

    // Get member details including name
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('member_id, name')
      .eq('id', memberId)
      .single();

    if (memberError || !member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Get existing bank details if any
    const { data: bankDetails, error: bankError } = await supabase
      .from('bank_details')
      .select('*')
      .eq('member_id', member.member_id)
      .single();

    res.json({
      member_name: member.name,
      bank_details: bankDetails || null
    });

  } catch (error) {
    console.error('Error fetching bank details:', error);
    res.status(500).json({ error: 'Failed to fetch bank details' });
  }
});

// Save/update bank details
app.post('/api/bank-details', authenticateToken, async (req, res) => {
  try {
    const memberId = req.user.memberId;
    const bankData = req.body;

    // Validate required fields
    const requiredFields = ['bankName', 'branchName', 'ifscCode', 'accountNumber', 'accountType', 'panNumber'];
    const missingFields = requiredFields.filter(field => !bankData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        missingFields 
      });
    }

    // Get member details
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('member_id, name')
      .eq('id', memberId)
      .single();

    if (memberError || !member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Check if bank details already exist
    const { data: existingDetails, error: existingError } = await supabase
      .from('bank_details')
      .select('id')
      .eq('member_id', member.member_id)
      .single();

    let result;
    if (existingDetails) {
      // Update existing record
      const { data, error } = await supabase
        .from('bank_details')
        .update({
          bank_name: bankData.bankName,
          branch_name: bankData.branchName,
          ifsc_code: bankData.ifscCode,
          account_number: bankData.accountNumber,
          account_type: bankData.accountType,
          pan_number: bankData.panNumber,
          updated_at: new Date().toISOString()
        })
        .eq('member_id', member.member_id)
        .select();
      
      result = data;
      if (error) throw error;
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('bank_details')
        .insert([{
          member_id: member.member_id,
          account_holder_name: member.name,
          bank_name: bankData.bankName,
          branch_name: bankData.branchName,
          ifsc_code: bankData.ifscCode,
          account_number: bankData.accountNumber,
          account_type: bankData.accountType,
          pan_number: bankData.panNumber
        }])
        .select();
      
      result = data;
      if (error) throw error;
    }

    res.json({
      success: true,
      message: 'Bank details saved successfully',
      bank_details: result
    });

  } catch (error) {
    console.error('Error saving bank details:', error);
    res.status(500).json({ error: 'Failed to save bank details' });
  }
});


//update pass
app.post('/api/reset-password', authenticateToken, async (req, res) => {
  try {
    const memberId = req.user.memberId;
    const { oldPassword, newPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Both old and new passwords are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    // Get current member details
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('password')
      .eq('id', memberId)
      .single();

    if (memberError || !member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Verify old password matches (plain text comparison)
    if (member.password !== oldPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password in database (plain text)
    const { error: updateError } = await supabase
      .from('members')
      .update({ 
        password: newPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', memberId);

    if (updateError) throw updateError;

    res.json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});


//member profile update
// Get profile data
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const memberId = req.user.memberId;

    // Get member basic info
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('member_id, name, phone_number, email')
      .eq('id', memberId)
      .single();

    if (memberError || !member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Get profile details
    const { data: profile, error: profileError } = await supabase
      .from('member_profiles')
      .select('*')
      .eq('member_id', member.member_id)
      .single();

    res.json({
      name: member.name,
      mobile: member.phone_number,
      email: member.email,
      dob: profile?.dob || '',
      gender: profile?.gender || '',
      location: profile?.location || '',
      pincode: profile?.pincode || ''
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile data' });
  }
});

// Update profile
app.post('/api/profile', authenticateToken, async (req, res) => {
  try {
    const memberId = req.user.memberId;
    const { name, mobile, email, dob, gender, location, pincode } = req.body;

    // Validate required fields
    if (!name || !mobile || !email) {
      return res.status(400).json({ 
        success: false,
        error: 'Name, mobile and email are required' 
      });
    }

    // Get member_id first
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('member_id')
      .eq('id', memberId)
      .single();

    if (memberError || !member) {
      return res.status(404).json({ 
        success: false,
        error: 'Member not found' 
      });
    }

    // Check if profile exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('member_profiles')
      .select('member_id')
      .eq('member_id', member.member_id)
      .maybeSingle();

    if (profileError) throw profileError;

    // Update member table
    const { error: updateMemberError } = await supabase
      .from('members')
      .update({
        name,
        phone_number: mobile,
        email,
        updated_at: new Date().toISOString()
      })
      .eq('id', memberId);

    if (updateMemberError) throw updateMemberError;

    // Prepare profile data
    const profileData = {
      member_id: member.member_id,
      dob,
      gender,
      location,
      pincode,
      updated_at: new Date().toISOString()
    };

    // Update or insert profile data
    let upsertError;
    if (existingProfile) {
      // Update existing profile
      const { error } = await supabase
        .from('member_profiles')
        .update(profileData)
        .eq('member_id', member.member_id);
      upsertError = error;
    } else {
      // Insert new profile
      const { error } = await supabase
        .from('member_profiles')
        .insert(profileData);
      upsertError = error;
    }

    if (upsertError) throw upsertError;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        name,
        mobile,
        email,
        dob,
        gender,
        location,
        pincode
      }
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update profile',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});