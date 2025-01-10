async function executeQuery(pool, query, params) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(query, params);
    return results;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

export async function listOwnedItems(req, res) {
  const pool = req.app.get('db');
  try {
    const users = await executeQuery(pool, 'SELECT userID, created_at FROM users');
    const badges = await executeQuery(pool, 'SELECT * FROM badges');
    const ownedItems = [];

    for (const user of users) {
      const userID = user.userID;
      const userCreatedAt = user.created_at;
      const userStatistics = await executeQuery(pool, 'SELECT * FROM statistics WHERE userID = ?', [userID]);
      const userData = await executeQuery(pool, 'SELECT * FROM users WHERE userID = ?', [userID]);

      const validTemperatures = userStatistics.map(stat => parseFloat(stat.temperature)).filter(temp => !isNaN(temp));
      const averageTemperature = validTemperatures.reduce((sum, temp) => sum + temp, 0) / validTemperatures.length;
      const statisticsEntriesCount = userStatistics.length;
      const coins = userData[0].coins;

      const filteredBadges = badges.filter(badge => {
        switch (badge.badgeID) {
          case 1:
            return true;
          case 2:
            return averageTemperature <= 28;
          case 3:
            return averageTemperature <= 22;
          case 4:
            return averageTemperature <= 18;
          case 5:
            return coins >= 1000;
          case 6:
            return coins >= 3000;
          case 7:
            return coins >= 10000;
          case 8:
            return statisticsEntriesCount >= 1;
          case 9:
            return statisticsEntriesCount >= 10;
          case 10:
            return statisticsEntriesCount >= 100;
          default:
            return false;
        }
      });

      filteredBadges.forEach(badge => {
        let createdAt = new Date();
        switch (badge.badgeID) {
          case 1:
            createdAt = userCreatedAt;
            break;
          case 2:
            createdAt = userStatistics.find(stat => parseFloat(stat.temperature) <= 28)?.created_at || new Date();
            break;
          case 3:
            createdAt = userStatistics.find(stat => parseFloat(stat.temperature) <= 22)?.created_at || new Date();
            break;
          case 4:
            createdAt = userStatistics.find(stat => parseFloat(stat.temperature) <= 18)?.created_at || new Date();
            break;
          case 5:
            createdAt = userStatistics.find(stat => coins >= 1000)?.created_at || new Date();
            break;
          case 6:
            createdAt = userStatistics.find(stat => coins >= 3000)?.created_at || new Date();
            break;
          case 7:
            createdAt = userStatistics.find(stat => coins >= 10000)?.created_at || new Date();
            break;
          case 8:
            createdAt = userStatistics.find(stat => statisticsEntriesCount >= 1)?.created_at || new Date();
            break;
          case 9:
            createdAt = userStatistics.find(stat => statisticsEntriesCount >= 10)?.created_at || new Date();
            break;
          case 10:
            createdAt = userStatistics.find(stat => statisticsEntriesCount >= 100)?.created_at || new Date();
            break;
        }

        ownedItems.push({
          userID,
          badgeID: badge.badgeID,
          created_at: createdAt,
          updated_at: new Date()
        });
      });

      // Sort ownedItems by created_at to ensure the first badge is the one that has been created first
      ownedItems.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    res.status(200).send(ownedItems);
  } catch (error) {
    console.error('Error listing owned items:', error);
    res.status(500).send('An error occurred while listing the owned items.');
  }
}

export async function getOwnedItems(req, res) {
  const pool = req.app.get('db');
  const { userID } = req.params;
  try {
    const badges = await executeQuery(pool, 'SELECT * FROM badges');
    const userStatistics = await executeQuery(pool, 'SELECT * FROM statistics WHERE userID = ?', [userID]);
    const userData = await executeQuery(pool, 'SELECT * FROM users WHERE userID = ?', [userID]);
    const userCreatedAt = userData[0].created_at;

    const validTemperatures = userStatistics.map(stat => parseFloat(stat.temperature)).filter(temp => !isNaN(temp));
    const averageTemperature = validTemperatures.reduce((sum, temp) => sum + temp, 0) / validTemperatures.length;
    const statisticsEntriesCount = userStatistics.length;
    const coins = userData[0].coins;

    const filteredBadges = badges.filter(badge => {
      switch (badge.badgeID) {
        case 1:
          return true;
        case 2:
          return averageTemperature <= 28;
        case 3:
          return averageTemperature <= 22;
        case 4:
          return averageTemperature <= 18;
        case 5:
          return coins >= 1000;
        case 6:
          return coins >= 3000;
        case 7:
          return coins >= 10000;
        case 8:
          return statisticsEntriesCount >= 1;
        case 9:
          return statisticsEntriesCount >= 10;
        case 10:
          return statisticsEntriesCount >= 100;
        default:
          return false;
      }
    });

    const ownedItems = filteredBadges.map(badge => {
      let createdAt = new Date();
      switch (badge.badgeID) {
        case 1:
          createdAt = userCreatedAt;
          break;
        case 2:
          createdAt = userStatistics.find(stat => parseFloat(stat.temperature) <= 28)?.created_at || new Date();
          break;
        case 3:
          createdAt = userStatistics.find(stat => parseFloat(stat.temperature) <= 22)?.created_at || new Date();
          break;
        case 4:
          createdAt = userStatistics.find(stat => parseFloat(stat.temperature) <= 18)?.created_at || new Date();
          break;
        case 5:
          createdAt = userStatistics.find(stat => coins >= 1000)?.created_at || new Date();
          break;
        case 6:
          createdAt = userStatistics.find(stat => coins >= 3000)?.created_at || new Date();
          break;
        case 7:
          createdAt = userStatistics.find(stat => coins >= 10000)?.created_at || new Date();
          break;
        case 8:
          createdAt = userStatistics.find(stat => statisticsEntriesCount >= 1)?.created_at || new Date();
          break;
        case 9:
          createdAt = userStatistics.find(stat => statisticsEntriesCount >= 10)?.created_at || new Date();
          break;
        case 10:
          createdAt = userStatistics.find(stat => statisticsEntriesCount >= 100)?.created_at || new Date();
          break;
      }

      return {
        userID,
        badgeID: badge.badgeID,
        created_at: createdAt,
        updated_at: new Date()
      };
    });

    // Sort ownedItems by created_at to ensure the first badge is the one that has been created first
    ownedItems.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    res.status(200).send(ownedItems);
  } catch (error) {
    console.error('Error getting owned items:', error);
    res.status(500).send('An error occurred while getting the owned items.');
  }
}

export async function updateOwnedItems(req, res) {
  const pool = req.app.get('db');
  const { userID } = req.params;
  const { badgeID, itemPrice } = req.body;

  try {
    const result = await executeQuery(pool, 'UPDATE owned_items SET itemPrice = ? WHERE userID = ? AND badgeID = ?', [itemPrice, userID, badgeID]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Owned item not found.');
    }
    res.status(200).send('Owned item updated successfully.');
  } catch (error) {
    console.error('Error updating owned item:', error);
    res.status(500).send('An error occurred while updating the owned item.');
  }
}

export async function addOwnedItem(req, res) {
  const pool = req.app.get('db');
  const { userID } = req.params;
  const { badgeID, itemPrice } = req.query;

  try {
    const result = await executeQuery(pool, 'INSERT INTO owned_items (userID, badgeID, itemPrice) VALUES (?, ?, ?)', [userID, badgeID, itemPrice]);
    res.status(201).send('Owned item added successfully.');
  } catch (error) {
    console.error('Error adding owned item:', error);
    res.status(500).send('An error occurred while adding the owned item.');
  }
}
