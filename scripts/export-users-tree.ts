
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import User from '../src/models/User';

dotenv.config();

const MONGODB_URI = process.env.VITE_MONGODB_URI || process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI not found in .env file.');
    process.exit(1);
}

import dns from 'dns';
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
    // Ignore
}

// 1. Define Binary Tree Node
class TreeNode {
    user: any;
    left: TreeNode | null = null;
    right: TreeNode | null = null;

    constructor(user: any) {
        this.user = user;
    }
}

// 2. Define Binary Search Tree
class UserBinaryTree {
    root: TreeNode | null = null;

    insert(user: any) {
        const newNode = new TreeNode(user);
        if (!this.root) {
            this.root = newNode;
            return;
        }
        this.insertNode(this.root, newNode);
    }

    private insertNode(node: TreeNode, newNode: TreeNode) {
        // Sort alphabetically by Username
        if (newNode.user.username.toLowerCase() < node.user.username.toLowerCase()) {
            if (!node.left) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (!node.right) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }

    // 3. Render Tree to String (Visual format)
    printTree(node: TreeNode | null = this.root, prefix: string = '', isLeft: boolean = true): string {
        if (!node) return '';

        let result = '';
        if (node.right) {
            result += this.printTree(node.right, prefix + (isLeft ? '│   ' : '    '), false);
        }

        result += prefix + (isLeft ? '└── ' : '┌── ') + `[${node.user.username}] (${node.user.email}) - Hash: ${node.user.password.substring(0, 10)}...\n`;

        if (node.left) {
            result += this.printTree(node.left, prefix + (isLeft ? '    ' : '│   '), true);
        }

        return result;
    }

    // 4. Render as JSON-like list (Backup)
    toList(node: TreeNode | null = this.root): string {
        if (!node) return '';
        let result = `User: ${node.user.username}\nEmail: ${node.user.email}\nPassHash: ${node.user.password}\n-----------------------------------\n`;
        if (node.left) result += this.toList(node.left);
        if (node.right) result += this.toList(node.right);
        return result;
    }
}

async function exportUsersToTree() {
    console.log('🌳 Connecting to DB...');
    await mongoose.connect(MONGODB_URI as string);

    console.log('📥 Fetching Users...');
    const users = await User.find({}).lean();
    console.log(`✅ Found ${users.length} users.`);

    const bst = new UserBinaryTree();
    users.forEach(user => bst.insert(user));

    console.log('🌲 Generating Tree Structure...');
    const treeVisual = bst.printTree();
    const fullList = bst.toList();

    const outputContent = `
===================================================
 AXIANT INTELLIGENCE - USER DATABASE (BINARY TREE)
===================================================
Generated: ${new Date().toLocaleString()}
Total Users: ${users.length}
Note: Passwords are hashed for security (Argon2).

VISUAL TREE STRUCTURE (Sorted by Username)
===================================================
${treeVisual}

FULL DETAILED LIST (Traversed)
===================================================
${fullList}
    `;

    const outputPath = path.resolve(process.cwd(), 'user_tree_data.txt');
    fs.writeFileSync(outputPath, outputContent);

    console.log(`\n📄 Data saved to: ${outputPath}`);

    await mongoose.disconnect();
}

exportUsersToTree();
