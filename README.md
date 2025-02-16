# Discord Emoji Duplicate Remover

A Node.js utility that finds and removes duplicate emojis across multiple Discord servers. The tool compares emojis byte-by-byte to ensure exact matches and automatically removes duplicates while keeping one copy.

## Features

- Scans multiple Discord servers for emojis
- Identifies exact duplicates through binary comparison
- Keeps the first instance of each emoji and removes duplicates

## Prerequisites

- Node.js 20.0.0 or higher
- A Discord bot token

## Installation

1. Clone the repository:

```bash
git clone https://github.com/loonsies/discord-emoji-duplicate-remover.git
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with your Discord bot token:  

```bash
DISCORD_TOKEN=your_discord_bot_token_here
```

4. Start the bot: 

```bash
npm start
```

## Why?

I hate discord emojis servers. I go on them, dump all their emojis, leave and make my own private dump emoji server.
