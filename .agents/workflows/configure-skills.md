# Configure Skills Workflow

**Description**: An interactive agent workflow that scans all available skills (global and local), identifies which ones are missing configurations, dependencies, or source files, and guides the user through fixing and testing them one by one.

---

## Step 1: Scan and Report
- Search global and local workspace `.agents/skills` directories.
- Read the `description` or `summary` field from each `SKILL.md` to understand what the skill does.
- Identify skills that need configuration based on these criteria:
  - **Incomplete Source**: The folder only contains `SKILL.md` (or very few files), but the `SKILL.md` has a `source:` GitHub link.
  - **Missing Dependencies**: `requirements.txt` or `package.json` exists, but there is no evidence of installation (e.g. no `node_modules`).
  - **Missing Environment Config**: `.env.example` is present, but no `.env` file exists.
- Present a numbered list of skills to the user **grouped by missing configuration category**.
- For each presented skill, include:
  - The skill's name.
  - A short, 1-2 sentence description of its purpose/tasks (derived from `SKILL.md`).
  - Exactly what needs to be configured.

## Step 2: User Selection
- Ask the user: *"Which skill number/name would you like to configure first? (Or type 'exit' to stop)."*
- **STOP** and wait for the user's input.

## Step 3: Interactive Configuration
Depending on the missing components of the selected skill, execute the following actions:
- **For Incomplete Source**: 
  - Clone the source repository to a temp directory.
  - Copy the scripts and missing files into the skill's directory.
- **For Missing Dependencies**: 
  - Run `pip install -r requirements.txt` or `npm install` inside the skill's folder.
- **For Environment Variables**: 
  - Copy `.env.example` to a new `.env` file.
  - Display the required keys to the user.
  - **STOP** and wait for the user to confirm they have added their API keys.

## Step 4: Test the Skill
- Read the newly configured skill's `SKILL.md` to extract a basic example command.
- Execute a simple dry run or basic test.
- Check the output/status. If it fails, troubleshoot. If it succeeds, inform the user.

## Step 5: Loop to Next Skill
- Ask the user: *"Skill successfully configured and tested! Would you like to select another from the list? (Reply with the name/number, or 'no' to finish)."*
- **STOP** and evaluate user response. If they provide a new skill, jump back to **Step 3**. Otherwise, conclude.
