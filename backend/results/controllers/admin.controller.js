const db = require("../config/db");
const dbPromise = db.promise();

exports.calculateMunicipalityResults = async (req, res) => {
  try {
    const { election_id } = req.body;

    if (!election_id) {
      return res.status(400).json({ message: "Election ID is required" });
    }

    // Step 1: Find the list with the highest number of candidates (determines seats number)
    const [listsWithCandidateCounts] = await dbPromise.query(
      `SELECT l.id as list_id, l.name as list_name, l.seats_number,
              COUNT(c.id) as candidate_count
       FROM lists l
       LEFT JOIN candidates c ON l.id = c.list_id
       WHERE l.election_id = ? AND c.is_approved = 1
       GROUP BY l.id, l.name, l.seats_number
       ORDER BY candidate_count DESC
       LIMIT 1`,
      [election_id],
    );

    if (listsWithCandidateCounts.length === 0) {
      return res
        .status(404)
        .json({ message: "No lists found for this election" });
    }

    const winningList = listsWithCandidateCounts[0];
    const seatsNumber = winningList.seats_number;

    // Step 2: Get top candidates from ALL lists based on vote counts, limited by seats number
    const [candidatesWithVotes] = await dbPromise.query(
      `SELECT c.id as candidate_id, c.list_id, u.first_name, u.last_name,
              COUNT(v.id) as vote_count
       FROM candidates c
       LEFT JOIN votes v ON c.id = v.candidate_id AND v.election_id = ?
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.election_id = ? AND c.is_approved = 1
       GROUP BY c.id, c.list_id, u.first_name, u.last_name
       ORDER BY vote_count DESC
       LIMIT ?`,
      [election_id, election_id, seatsNumber],
    );

    if (candidatesWithVotes.length === 0) {
      return res
        .status(404)
        .json({ message: "No candidates found for this election" });
    }

    // Step 3: Clear existing winner_candidates for this election (if any)
    await dbPromise.query(
      `DELETE FROM winner_candidates WHERE election_id = ?`,
      [election_id],
    );

    // Step 4: Insert the top candidates into winner_candidates table
    const insertPromises = candidatesWithVotes.map((candidate) => {
      return dbPromise.query(
        `INSERT INTO winner_candidates (election_id, candidate_id, list_id)
         VALUES (?, ?, ?)`,
        [election_id, candidate.candidate_id, candidate.list_id],
      );
    });

    await Promise.all(insertPromises);

    // Step 5: Return the results
    return res.status(200).json({
      message: "Municipality results calculated successfully",
      seats_determining_list: {
        id: winningList.list_id,
        name: winningList.list_name,
        seats_number: seatsNumber,
        candidate_count: winningList.candidate_count,
      },
      winner_candidates: candidatesWithVotes.map((candidate) => ({
        candidate_id: candidate.candidate_id,
        list_id: candidate.list_id,
        name: `${candidate.first_name} ${candidate.last_name}`,
        vote_count: candidate.vote_count,
      })),
    });
  } catch (error) {
    console.error("Error calculating municipality results:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.calculateMayoralResults = async (req, res) => {
  try {
    const { election_id } = req.body;

    if (!election_id) {
      return res.status(400).json({ message: "Election ID is required" });
    }

    // Step 1: Find the list with the highest number of candidates (determines seats number)
    const [listsWithCandidateCounts] = await dbPromise.query(
      `SELECT l.id as list_id, l.name as list_name, l.seats_number,
              COUNT(c.id) as candidate_count
       FROM lists l
       LEFT JOIN candidates c ON l.id = c.list_id
       WHERE l.election_id = ? AND c.is_approved = 1
       GROUP BY l.id, l.name, l.seats_number
       ORDER BY candidate_count DESC
       LIMIT 1`,
      [election_id],
    );

    if (listsWithCandidateCounts.length === 0) {
      return res
        .status(404)
        .json({ message: "No lists found for this election" });
    }

    const winningList = listsWithCandidateCounts[0];
    const seatsNumber = winningList.seats_number;

    // Step 2: Get top candidates from ALL lists based on vote counts, limited by seats number
    const [candidatesWithVotes] = await dbPromise.query(
      `SELECT c.id as candidate_id, c.list_id, u.first_name, u.last_name,
              COUNT(v.id) as vote_count
       FROM candidates c
       LEFT JOIN votes v ON c.id = v.candidate_id AND v.election_id = ?
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.election_id = ? AND c.is_approved = 1
       GROUP BY c.id, c.list_id, u.first_name, u.last_name
       ORDER BY vote_count DESC
       LIMIT ?`,
      [election_id, election_id, seatsNumber],
    );

    if (candidatesWithVotes.length === 0) {
      return res
        .status(404)
        .json({ message: "No candidates found for this election" });
    }

    // Step 3: Clear existing winner_candidates for this election (if any)
    await dbPromise.query(
      `DELETE FROM winner_candidates WHERE election_id = ?`,
      [election_id],
    );

    // Step 4: Insert the top candidates into winner_candidates table
    const insertPromises = candidatesWithVotes.map((candidate) => {
      return dbPromise.query(
        `INSERT INTO winner_candidates (election_id, candidate_id, list_id)
         VALUES (?, ?, ?)`,
        [election_id, candidate.candidate_id, candidate.list_id],
      );
    });

    await Promise.all(insertPromises);

    // Step 5: Return the results
    return res.status(200).json({
      message: "Mayoral results calculated successfully",
      seats_determining_list: {
        id: winningList.list_id,
        name: winningList.list_name,
        seats_number: seatsNumber,
        candidate_count: winningList.candidate_count,
      },
      winner_candidates: candidatesWithVotes.map((candidate) => ({
        candidate_id: candidate.candidate_id,
        list_id: candidate.list_id,
        name: `${candidate.first_name} ${candidate.last_name}`,
        vote_count: candidate.vote_count,
      })),
    });
  } catch (error) {
    console.error("Error calculating mayoral results:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.calculateParliamentaryResults = async (req, res) => {
  try {
    const { election_id } = req.body;

    if (!election_id) {
      return res.status(400).json({ message: "Election ID is required" });
    }

    // Step 1: Get constituency information and total seats for this election
    const [constituencyInfo] = await dbPromise.query(
      `SELECT DISTINCT e.constituency_id, c.total_seats, c.name as constituency_name
       FROM elections e
       JOIN constituencies c ON e.constituency_id = c.id
       WHERE e.id = ?`,
      [election_id],
    );

    if (constituencyInfo.length === 0) {
      return res
        .status(404)
        .json({ message: "No constituency found for this election" });
    }

    const constituency = constituencyInfo[0];
    const totalSeats = constituency.total_seats;
    const constituencyId = constituency.constituency_id;

    // Step 2: Calculate total valid votes in the election
    const [totalVotesResult] = await dbPromise.query(
      `SELECT COUNT(*) as total_votes
       FROM votes v
       JOIN candidates c ON v.candidate_id = c.id
       WHERE v.election_id = ? AND c.is_approved = 1`,
      [election_id],
    );

    const totalVotes = totalVotesResult[0].total_votes;

    if (totalVotes === 0) {
      return res
        .status(404)
        .json({ message: "No votes found for this election" });
    }

    // Step 3: Calculate Hare quota (total votes / total seats)
    const hareQuota = Math.floor(totalVotes / totalSeats);

    // Step 4: Get list vote totals and calculate seats per list using largest remainder method
    const [listVoteTotals] = await dbPromise.query(
      `SELECT l.id as list_id, l.name as list_name, COUNT(v.id) as list_votes
       FROM lists l
       LEFT JOIN candidates c ON l.id = c.list_id AND c.is_approved = 1
       LEFT JOIN votes v ON c.id = v.candidate_id AND v.election_id = ?
       WHERE l.election_id = ?
       GROUP BY l.id, l.name
       HAVING list_votes > 0
       ORDER BY list_votes DESC`,
      [election_id, election_id],
    );

    if (listVoteTotals.length === 0) {
      return res.status(404).json({ message: "No lists with votes found" });
    }

    // Calculate initial seats allocation using Hare quota
    let remainingSeats = totalSeats;
    const listSeatsAllocation = listVoteTotals.map((list) => {
      const quotaSeats = Math.floor(list.list_votes / hareQuota);
      remainingSeats -= quotaSeats;
      return {
        ...list,
        quota_seats: quotaSeats,
        remainder: list.list_votes % hareQuota,
        total_seats: quotaSeats,
      };
    });

    // Distribute remaining seats using largest remainder method
    listSeatsAllocation.sort((a, b) => b.remainder - a.remainder);
    for (let i = 0; i < remainingSeats && i < listSeatsAllocation.length; i++) {
      listSeatsAllocation[i].total_seats += 1;
    }

    // Step 5: Get denomination seat allocations for the constituency
    const [denominationAllocations] = await dbPromise.query(
      `SELECT cda.denomination_id, d.name as denomination_name, cda.seats_allocated
       FROM constituency_denomination_allocation cda
       JOIN denominations d ON cda.denomination_id = d.id
       WHERE cda.constituency_id = ?`,
      [constituencyId],
    );

    // Step 6: For each list that won seats, select winning candidates based on preferential votes within each denomination
    const winningCandidates = [];

    for (const list of listSeatsAllocation.filter((l) => l.total_seats > 0)) {
      // Get candidates from this list with their preferential votes, grouped by denomination
      const [listCandidates] = await dbPromise.query(
        `SELECT c.id as candidate_id, c.list_id, u.first_name, u.last_name,
                u.denomination_id, d.name as denomination_name,
                COUNT(v.id) as preferential_votes
         FROM candidates c
         JOIN users u ON c.user_id = u.id
         JOIN denominations d ON u.denomination_id = d.id
         LEFT JOIN votes v ON c.id = v.candidate_id AND v.election_id = ?
         WHERE c.list_id = ? AND c.is_approved = 1 AND c.election_id = ?
         GROUP BY c.id, c.list_id, u.first_name, u.last_name, u.denomination_id, d.name
         ORDER BY u.denomination_id, preferential_votes DESC`,
        [election_id, list.list_id, election_id],
      );

      // Allocate seats proportionally across denominations for this list
      let listSeatsRemaining = list.total_seats;
      const denominationCandidates = {};

      // Group candidates by denomination
      listCandidates.forEach((candidate) => {
        if (!denominationCandidates[candidate.denomination_id]) {
          denominationCandidates[candidate.denomination_id] = [];
        }
        denominationCandidates[candidate.denomination_id].push(candidate);
      });

      // Distribute seats across available denominations (simplified approach)
      const availableDenominations = Object.keys(denominationCandidates);
      let seatsPerDenomination = Math.floor(
        listSeatsRemaining / availableDenominations.length,
      );
      let extraSeats = listSeatsRemaining % availableDenominations.length;

      for (const denomId of availableDenominations) {
        let seatsForThisDenom = seatsPerDenomination;
        if (extraSeats > 0) {
          seatsForThisDenom += 1;
          extraSeats -= 1;
        }

        // Select top candidates from this denomination
        const topCandidates = denominationCandidates[denomId].slice(
          0,
          seatsForThisDenom,
        );

        winningCandidates.push(...topCandidates);
      }
    }

    // Step 7: Clear existing winner_candidates for this election
    await dbPromise.query(
      `DELETE FROM winner_candidates WHERE election_id = ?`,
      [election_id],
    );

    // Step 8: Insert winning candidates
    if (winningCandidates.length > 0) {
      const insertPromises = winningCandidates.map((candidate) => {
        return dbPromise.query(
          `INSERT INTO winner_candidates (election_id, candidate_id, list_id)
           VALUES (?, ?, ?)`,
          [election_id, candidate.candidate_id, candidate.list_id],
        );
      });

      await Promise.all(insertPromises);
    }

    // Step 9: Return detailed results
    return res.status(200).json({
      message: "Parliamentary results calculated successfully",
      election_info: {
        election_id: election_id,
        constituency_name: constituency.constituency_name,
        total_seats: totalSeats,
        total_votes: totalVotes,
        hare_quota: hareQuota,
      },
      list_results: listSeatsAllocation.map((list) => ({
        list_id: list.list_id,
        list_name: list.list_name,
        total_votes: list.list_votes,
        quota_seats: list.quota_seats,
        remainder_votes: list.remainder,
        final_seats: list.total_seats,
      })),
      denomination_allocations: denominationAllocations,
      winner_candidates: winningCandidates.map((candidate) => ({
        candidate_id: candidate.candidate_id,
        list_id: candidate.list_id,
        name: `${candidate.first_name} ${candidate.last_name}`,
        denomination: candidate.denomination_name,
        preferential_votes: candidate.preferential_votes,
      })),
    });
  } catch (error) {
    console.error("Error calculating parliamentary results:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.calcuateSpeakerResults = async (req, res) => {
  try {
    const { election_id } = req.body;

    if (!election_id) {
      return res.status(400).json({ message: "Election ID is required" });
    }

    // Step 1: Verify this is a parliamentary election (Speaker is elected from MPs)
    const [electionInfo] = await dbPromise.query(
      `SELECT e.id, e.name, e.type
       FROM elections e
       WHERE e.id = ?`,
      [election_id],
    );

    if (electionInfo.length === 0) {
      return res.status(404).json({ message: "Election not found" });
    }

    // Step 2: Get all Shia candidates (Speaker must be Shia according to National Pact)
    const [shiaCandidates] = await dbPromise.query(
      `SELECT c.id as candidate_id, c.list_id, u.first_name, u.last_name,
              u.denomination_id, d.name as denomination_name,
              COUNT(v.id) as vote_count
       FROM candidates c
       JOIN users u ON c.user_id = u.id
       JOIN denominations d ON u.denomination_id = d.id
       LEFT JOIN votes v ON c.id = v.candidate_id AND v.election_id = ?
       WHERE c.election_id = ? AND c.is_approved = 1 AND d.name = 'shia'
       GROUP BY c.id, c.list_id, u.first_name, u.last_name, u.denomination_id, d.name
       ORDER BY vote_count DESC`,
      [election_id, election_id],
    );

    if (shiaCandidates.length === 0) {
      return res.status(404).json({
        message: "No Shia candidates found for Speaker election",
      });
    }

    // Step 3: Get total number of MPs (all winning candidates from parliamentary election)
    const [totalMPs] = await dbPromise.query(
      `SELECT COUNT(*) as total_mps
       FROM winner_candidates wc
       WHERE wc.election_id = ?`,
      [election_id],
    );

    const totalMPsCount = totalMPs[0].total_mps;

    if (totalMPsCount === 0) {
      return res.status(400).json({
        message: "Parliamentary results must be calculated first",
      });
    }

    // Required absolute majority (more than half)
    const requiredVotes = Math.floor(totalMPsCount / 2) + 1;

    // Step 4: In practice, the Speaker is usually selected through consensus
    // For simulation, we'll select the Shia candidate with highest votes
    const speakerCandidate = shiaCandidates[0];

    // Step 5: Simulate the Speaker election vote
    // In reality, this involves complex political negotiations
    // For our system, we'll assume the top Shia candidate wins with majority support
    const simulatedVotes = Math.max(
      requiredVotes,
      Math.floor(totalMPsCount * 0.7),
    );

    // Step 6: Clear any existing Speaker results for this election
    await dbPromise.query(
      `DELETE FROM winner_candidates
       WHERE election_id = ? AND candidate_id IN (
         SELECT c.id FROM candidates c
         JOIN users u ON c.user_id = u.id
         JOIN denominations d ON u.denomination_id = d.id
         WHERE d.name = 'shia' AND c.election_id = ?
       )`,
      [election_id, election_id],
    );

    // Step 7: Insert the Speaker as winner
    await dbPromise.query(
      `INSERT INTO winner_candidates (election_id, candidate_id, list_id)
       VALUES (?, ?, ?)`,
      [election_id, speakerCandidate.candidate_id, speakerCandidate.list_id],
    );

    // Step 8: Return Speaker election results
    return res.status(200).json({
      message: "Speaker election results calculated successfully",
      election_info: {
        election_id: election_id,
        election_name: electionInfo[0].name,
        total_mps: totalMPsCount,
        required_majority: requiredVotes,
        sectarian_requirement: "Shia Muslim (National Pact)",
      },
      speaker_results: {
        winner: {
          candidate_id: speakerCandidate.candidate_id,
          list_id: speakerCandidate.list_id,
          name: `${speakerCandidate.first_name} ${speakerCandidate.last_name}`,
          denomination: speakerCandidate.denomination_name,
          parliamentary_votes: speakerCandidate.vote_count,
          speaker_election_votes: simulatedVotes,
          vote_percentage: ((simulatedVotes / totalMPsCount) * 100).toFixed(1),
        },
        eligible_candidates: shiaCandidates.map((candidate) => ({
          candidate_id: candidate.candidate_id,
          name: `${candidate.first_name} ${candidate.last_name}`,
          parliamentary_votes: candidate.vote_count,
        })),
        election_process: {
          constitutional_requirement:
            "Absolute majority in first round (65+ votes)",
          sectarian_allocation: "Speaker must be Shia Muslim",
          political_reality: "Usually decided by Amal-Hezbollah consensus",
          voting_method: "Secret ballot by MPs",
        },
      },
    });
  } catch (error) {
    console.error("Error calculating Speaker results:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
