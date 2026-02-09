using System;
using System.Collections.Generic;
using System.Linq;
using FiftyOnePlus.Model;

namespace FiftyOnePlus.Game
{
    public sealed class FinishEvaluator
    {
        private readonly GameState _state;

        public FinishEvaluator(GameState state)
        {
            _state = state ?? throw new ArgumentNullException(nameof(state));
        }

        public bool CanFinish(PlayerState player, IEnumerable<Meld> melds, out bool finishedWithPairs, out bool finishedWithOkey)
        {
            finishedWithPairs = false;
            finishedWithOkey = false;

            if (player == null || melds == null)
            {
                return false;
            }

            var meldList = melds.ToList();
            if (!meldList.Any())
            {
                return false;
            }

            foreach (var meld in meldList)
            {
                if (meld == null)
                {
                    return false;
                }

                var isValid = meld.Type == MeldType.Series ? meld.IsValidSeries() : meld.IsValidPairSet();
                if (!isValid)
                {
                    return false;
                }
            }

            var allMeldTiles = meldList.SelectMany(meld => meld.Tiles).ToList();
            if (allMeldTiles.Count != player.Hand.Count)
            {
                return false;
            }

            var remaining = new List<Tile>(allMeldTiles);
            foreach (var tile in player.Hand)
            {
                if (!RemoveTileOnce(remaining, tile))
                {
                    return false;
                }
            }

            finishedWithPairs = meldList.Any(meld => meld.Type == MeldType.PairSet);
            finishedWithOkey = meldList.SelectMany(meld => meld.Tiles).Any(tile => tile.IsOkey);

            if (!player.HasOpenedSeries && !player.HasOpenedPairs)
            {
                var canOpenNow = meldList.Any(meld => meld.Type == MeldType.Series && RuleEngine.CanOpenSeries(meld, _state.LastOpenedSeriesValue))
                    || meldList.Any(meld => meld.Type == MeldType.PairSet && RuleEngine.CanOpenPairs(meld));

                if (!canOpenNow)
                {
                    return false;
                }
            }

            return true;
        }

        private static bool RemoveTileOnce(List<Tile> tiles, Tile tile)
        {
            var index = tiles.FindIndex(existing => existing.Equals(tile));
            if (index < 0)
            {
                return false;
            }

            tiles.RemoveAt(index);
            return true;
        }
    }
}