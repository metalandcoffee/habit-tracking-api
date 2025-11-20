import { db } from './connection.ts'
import { users, habits, entries, tags, habitTags } from './schema.ts'

const seed = async () => {
  console.log('🌱 Starting database seed...')

  try {
    // Step 1: Clear existing data (order matters)
    console.log('Clearing existing data...')
    await db.delete(entries) // Delete entries first (foreign keys)
    await db.delete(habitTags) // Delete junction table
    await db.delete(habits) // Delete habits
    await db.delete(tags) // Delete tags
    await db.delete(users) // Delete users last

    // Step 2: Create foundation data.
    console.log('Creating demo users...')
    const [testUser] = await db
      .insert(users)
      .values({
        email: 'demo@app.com',
        username: 'test_user',
        password: '12345',
        firstName: 'Test',
        lastName: 'User',
      })
      .returning()

    // Step 3: Create tags for categorization.
    console.log('Creating tags...')
    const [healthTag] = await db
      .insert(tags)
      .values({
        name: 'Health',
        color: '#10B981',
      })
      .returning()

    // Step 4: Create habits with relationships.
    console.log('Creating habits...')
    const [exerciseHabit] = await db
      .insert(habits)
      .values({
        userId: testUser.id,
        name: 'Exercise',
        description: 'Daily workout routine',
        frequency: 'daily',
        targetCount: 1,
      })
      .returning()
  } catch (e) {}
}
