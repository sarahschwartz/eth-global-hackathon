# Homebase
Hackathon submission for ETH Global

## Overview
Homebase helps creators engage with their communties using Lens Protocol, Unlock Protocol, and IPFS. 

Creators can create and manage Unlock locks, store content on IPFS, and post to Lens. Posts can be public or private, i.e. only available to wallets that have a key for a certain Unlock lock. 

Community users can buy a key for a lock, follow their favorite creators, and see locked content. 

## Creating a Profile / Getting Started
Before using the app make sure you have some test MATIC in your wallet and you are connected to the Polgon Mumbai network.

On the homepage, click the "Get started" button, which will walk you through creating a lens handle. The first step is to connect to lens to authenticate your session.

Next you can enter in the handle you want, and click "Create Lens profile" to mint your handle. If you've already created a handle for the wallet you connected, you can also select your existing handle.

After this you will be forwarded to your dashboard. (You may have to refresh the page if indexing is slow.)

## Creator Dashboard
The creator dashboard is where creators can create posts, view recent posts, and manage their locks. You can find your dashboard at /dashboard/YOUR_HANDLE.test.

### Creating a Lock with Unlock
In your dashboard next to "My home locks", click the "Create lock" button. Choose a lock name, max number of keys, key price, and expiration duration, click "Create Lock", and confirm the transaction with your wallet. 

It may take a minute for the lock to be indexed. Refresh your dashboard to see your new lock and it's details under "My home locks". 

### Managing Your Locks
In your dashboard, click "Manage" next to the lock you want to update. Right now the only update you can make is updating the max number of keys that can be minted. 

### Granting Keys
Creators can grant keys to another wallet. We would have liked to find a way to query followers by the number of lens interactions they have had with a creator's profile to allow creators to reward their top followers with a key.

### Creating a Public Post
In your dashboard at the top of the page, write your post, upload and photos you want, and click "Post". Your public post data is stored with IPFS. You will be prompted to sign a couple messages and a transaction in your wallet. 
  
### Creating a Private Post for a Lock
To make your post private only to wallets that own a key for one of your locks, click the "private" option under "Who can see this post?".  You must select at least 1 lock. 

Only users who are logged in to a wallet that owns a key to at least 1 lock associated with that post with be able to view the content and images. Your private data is stored with Firebase, and a reference to that data is stored as an attribute in your lens post.

### Viewing your posts
You can see your recent posts in your dashboard use "My recent posts". You can also view all of your posts on your homebase page by clicking the "View all" button here or by going to /homebase/YOUR_HANDLE.test.

## Homebase Community

### Buying a Creator Key
You can buy a key for a creator's lock on their lock's page. You can see all of the locks made by someone in their homebase.

### Following a Lens Profile
You can click the "Follow" button on a profile's homebase to follow a profile.

### Viewing Your Timeline
You can see publications from your profile and profiles you follow by going to /timeline. 

## Testing Locally

First, create a .env.local file in the root directory, and add the environment variables as shown in the .env.example file.

Next, install with yarn and run the development server:

```bash
yarn install

yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
