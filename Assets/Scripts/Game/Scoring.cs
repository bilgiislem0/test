using System.Collections.Generic;
using System.Linq;
using FiftyOnePlus.Model;

namespace FiftyOnePlus.Game
{
    public sealed class RoundResult
    {
        public PlayerState Player { get; }
        public int RoundPenalty { get; }
        public bool FinishedByDiscardingLast { get; }

        public RoundResult(PlayerState player, int roundPenalty, bool finishedByDiscardingLast)
        {
            Player = player;
            RoundPenalty = roundPenalty;
            FinishedByDiscardingLast = finishedByDiscardingLast;
        }
    }

    public static class Scoring
    {
        public const int PenaltyForNoOpen = 102;
        public const int PenaltyForOkeyInHand = 51;
        public const int BonusForFinishing = 51;

        public static List<RoundResult> CalculateRound(GameState state, PlayerState finishedPlayer, bool finishedWithOkey, bool finishedWithPairs, bool onlyFinisherOpened)
        {
            var results = new List<RoundResult>();
            foreach (var player in state.Players)
            {
                var basePenalty = player.HasOpenedSeries || player.HasOpenedPairs
                    ? player.Hand.Sum(tile => tile.Value)
                    : PenaltyForNoOpen;

                if ((player.HasOpenedSeries || player.HasOpenedPairs) && player.Hand.Any(tile => tile.IsOkey))
                {
                    basePenalty += PenaltyForOkeyInHand;
                }

                var penalty = basePenalty;

                if (finishedPlayer != null)
                {
                    var multiplier = 1;
                    if (onlyFinisherOpened)
                    {
                        multiplier *= 2;
                    }

                    if (finishedWithPairs)
                    {
                        multiplier *= 2;
                    }

                    if (finishedWithOkey)
                    {
                        multiplier *= 2;
                    }

                    if (player == finishedPlayer)
                    {
                        penalty = basePenalty - BonusForFinishing * multiplier;
                    }
                    else
                    {
                        penalty = basePenalty * multiplier;
                    }
                }

                results.Add(new RoundResult(player, penalty, finishedPlayer == player));
            }

            return results;
        }
    }
}