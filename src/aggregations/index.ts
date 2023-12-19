export const commonChatAggregation =  [
    {
      $lookup: {
        from: 'users',
        localField: 'participants',
        foreignField: '_id',
        as: 'participants'
      }
    }, 
    {
      $project: {
          'participants.password': 0 // Exclude the "password" field
      }
  }
  ]
  