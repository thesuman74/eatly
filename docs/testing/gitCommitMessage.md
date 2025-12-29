# Git Commit Message Cheat Sheet

A short, professional guide to writing consistent and clear Git commit messages.

---

## 1. Commit Message Format

- **type** – the kind of change (see list below)
- **scope** – optional, module or area affected
- **short description** – imperative mood, <50 chars recommended

**Examples:**

---

## 2. Common Types

| Type         | Use case                                          |
| ------------ | ------------------------------------------------- |
| **feat**     | New feature                                       |
| **fix**      | Bug fix                                           |
| **chore**    | Build, dependencies, scripts                      |
| **docs**     | Documentation changes                             |
| **style**    | Formatting, linting, white-space (no code change) |
| **refactor** | Code change, no feature or fix                    |
| **test**     | Add or fix tests                                  |

---

## 3. Rules / Tips

1. Use **imperative mood**: `Add`, `Fix`, `Update` (not `Added`/`Fixed`)
2. Keep the first line **<50 characters**
3. Separate body with a blank line if needed
4. In the body, explain **why**, not **what** (diff shows what)

---

## 4. More Examples

- feat(order): create notification when order placed
- fix(notification): avoid undefined data.map error
- refactor(layout): align sidebar and bell icon
- chore(ci): add lint step in GitHub workflow
- docs(api): add endpoint description for notifications

---

## 5. Quick Reference Summary

- **feat** → new feature
- **fix** → bug fix
- **chore** → dependencies, scripts
- **docs** → documentation
- **style** → formatting only
- **refactor** → code improvement
- **test** → add or fix tests
