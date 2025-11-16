#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Emergency Service Fix Script');
console.log('================================\n');

// Check if MongoDB is running
const checkMongoDB = () => {
    console.log('1. Checking MongoDB...');
    try {
        const { execSync } = require('child_process');
        execSync('mongod --version', { stdio: 'ignore' });
        console.log('   ✅ MongoDB is installed');
        
        // Try to connect
        execSync('mongo --eval "db.runCommand({connectionStatus : 1})" --quiet', { stdio: 'ignore' });
        console.log('   ✅ MongoDB is running');
    } catch (error) {
        console.log('   ❌ MongoDB issue detected');
        console.log('   💡 Solution: Start MongoDB service');
        console.log('      Windows: net start MongoDB');
        console.log('      Mac: brew services start mongodb-community');
        console.log('      Linux: sudo systemctl start mongod');
    }
};

// Check server dependencies
const checkDependencies = () => {
    console.log('\n2. Checking server dependencies...');
    const serverPackageJson = path.join(__dirname, 'server', 'package.json');
    
    if (fs.existsSync(serverPackageJson)) {
        console.log('   ✅ Server package.json found');
        
        const nodeModules = path.join(__dirname, 'server', 'node_modules');
        if (fs.existsSync(nodeModules)) {
            console.log('   ✅ Server dependencies installed');
        } else {
            console.log('   ❌ Server dependencies missing');
            console.log('   💡 Solution: cd server && npm install');
        }
    } else {
        console.log('   ❌ Server package.json not found');
    }
};

// Check client dependencies
const checkClientDependencies = () => {
    console.log('\n3. Checking client dependencies...');
    const clientPackageJson = path.join(__dirname, 'client', 'package.json');
    
    if (fs.existsSync(clientPackageJson)) {
        console.log('   ✅ Client package.json found');
        
        const nodeModules = path.join(__dirname, 'client', 'node_modules');
        if (fs.existsSync(nodeModules)) {
            console.log('   ✅ Client dependencies installed');
        } else {
            console.log('   ❌ Client dependencies missing');
            console.log('   💡 Solution: cd client && npm install');
        }
    } else {
        console.log('   ❌ Client package.json not found');
    }
};

// Check environment files
const checkEnvFiles = () => {
    console.log('\n4. Checking environment configuration...');
    
    const serverEnv = path.join(__dirname, 'server', '.env');
    const clientEnv = path.join(__dirname, 'client', '.env');
    
    if (fs.existsSync(serverEnv)) {
        console.log('   ✅ Server .env file found');
        
        const envContent = fs.readFileSync(serverEnv, 'utf8');
        const requiredVars = ['MONGO_URL', 'EMAIL', 'PASSWORD', 'PORT'];
        
        requiredVars.forEach(varName => {
            if (envContent.includes(varName)) {
                console.log(`   ✅ ${varName} configured`);
            } else {
                console.log(`   ❌ ${varName} missing`);
            }
        });
    } else {
        console.log('   ❌ Server .env file missing');
        console.log('   💡 Solution: Copy .env.example to .env and configure');
    }
};

// Check ports
const checkPorts = () => {
    console.log('\n5. Checking port availability...');
    const net = require('net');
    
    const checkPort = (port, service) => {
        return new Promise((resolve) => {
            const server = net.createServer();
            server.listen(port, () => {
                server.close(() => {
                    console.log(`   ✅ Port ${port} (${service}) is available`);
                    resolve(true);
                });
            });
            server.on('error', () => {
                console.log(`   ❌ Port ${port} (${service}) is in use`);
                resolve(false);
            });
        });
    };
    
    return Promise.all([
        checkPort(5001, 'Server'),
        checkPort(3000, 'Client')
    ]);
};

// Main execution
const runDiagnostics = async () => {
    checkMongoDB();
    checkDependencies();
    checkClientDependencies();
    checkEnvFiles();
    await checkPorts();
    
    console.log('\n🎯 Quick Start Commands:');
    console.log('========================');
    console.log('1. Start MongoDB (if not running)');
    console.log('2. cd server && npm start');
    console.log('3. cd client && npm start');
    console.log('4. Test emergency: http://localhost:3000');
    
    console.log('\n🔍 Test Emergency Service:');
    console.log('==========================');
    console.log('cd server && node test-emergency-fix.js');
    
    console.log('\n✨ Emergency service should now be working!');
};

runDiagnostics().catch(console.error);