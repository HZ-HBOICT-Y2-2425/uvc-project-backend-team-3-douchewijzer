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
          createdAt = userStatistics.filter(stat => parseFloat(stat.temperature) <= 28).map(stat => new Date(stat.created_at)).sort((a, b) => a - b)[0] || new Date();
          break;
        case 3:
          createdAt = userStatistics.filter(stat => parseFloat(stat.temperature) <= 22).map(stat => new Date(stat.created_at)).sort((a, b) => a - b)[0] || new Date();
          break;
        case 4:
          createdAt = userStatistics.filter(stat => parseFloat(stat.temperature) <= 18).map(stat => new Date(stat.created_at)).sort((a, b) => a - b)[0] || new Date();
          break;
        case 5:
          createdAt = userStatistics.filter(stat => coins >= 1000).map(stat => new Date(stat.created_at)).sort((a, b) => a - b)[0] || new Date();
          break;
        case 6:
          createdAt = userStatistics.filter(stat => coins >= 3000).map(stat => new Date(stat.created_at)).sort((a, b) => a - b)[0] || new Date();
          break;
        case 7:
          createdAt = userStatistics.filter(stat => coins >= 10000).map(stat => new Date(stat.created_at)).sort((a, b) => a - b)[0] || new Date();
          break;
        case 8:
          createdAt = userStatistics.filter(stat => statisticsEntriesCount >= 1).map(stat => new Date(stat.created_at)).sort((a, b) => a - b)[0] || new Date();
          break;
        case 9:
          createdAt = userStatistics.filter(stat => statisticsEntriesCount >= 10).map(stat => new Date(stat.created_at)).sort((a, b) => a - b)[0] || new Date();
          break;
        case 10:
          createdAt = userStatistics.filter(stat => statisticsEntriesCount >= 100).map(stat => new Date(stat.created_at)).sort((a, b) => a - b)[0] || new Date();
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

    // Reverse the array
    ownedItems.reverse();

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
        createdAt = userStatistics.filter(stat => parseFloat(stat.temperature) <= 28).map(stat => new Date(stat.created_at)).sort((a, b) => a - b)[0] || new Date();
        break;
      case 3:
        createdAt = userStatistics.filter(stat => parseFloat(stat.temperature) <= 22).map(stat => new Date(stat.created_at)).sort((a, b) => a - b)[0] || new Date();
        break;
      case 4:
        createdAt = userStatistics.filter(stat => parseFloat(stat.temperature) <= 18).map(stat => new Date(stat.created_at)).sort((a, b) => a - b)[0] || new Date();
        break;
      case 5:
        createdAt = userStatistics.filter(stat => coins >= 1000).map(stat => new Date(stat.created_at)).sort((a, b) => a - b)[0] || new Date();
        break;
      case 6:
        createdAt = userStatistics.filter(stat => coins >= 3000).map(stat => new Date(stat.created_at)).sort((a, b) => a - b)[0] || new Date();
        break;
      case 7:
        createdAt = userStatistics.filter(stat => coins >= 10000).map(stat => new Date(stat.created_at)).sort((a, b) => a - b)[0] || new Date();
        break;
      case 8:
        createdAt = userStatistics.filter(stat => statisticsEntriesCount >= 1).map(stat => new Date(stat.created_at)).sort((a, b) => a - b)[0] || new Date();
        break;
      case 9:
        createdAt = userStatistics.filter(stat => statisticsEntriesCount >= 10).map(stat => new Date(stat.created_at)).sort((a, b) => a - b)[0] || new Date();
        break;
      case 10:
        createdAt = userStatistics.filter(stat => statisticsEntriesCount >= 100).map(stat => new Date(stat.created_at)).sort((a, b) => a - b)[0] || new Date();
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

    // Reverse the array
    ownedItems.reverse();

    res.status(200).send(ownedItems);
  } catch (error) {
    console.error('Error getting owned items:', error);
    res.status(500).send('An error occurred while getting the owned items.');
  }
}
