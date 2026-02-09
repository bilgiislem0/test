using System.Collections.Generic;
using System.Linq;
using FiftyOnePlus.Model;

namespace FiftyOnePlus.Game
{
    public static class RuleEngine
    {
        public const int MinimumSeriesValue = 51;
        public const int MinimumPairCount = 4;

        public static int CalculateMeldValue(IEnumerable<Tile> tiles)
        {
            return tiles.Sum(tile => tile.Value);
        }

        public static bool CanOpenSeries(Meld meld, int lastOpenedValue)
        {
            if (!meld.IsValidSeries())
            {
                return false;
            }

            var total = meld.TotalValue;
            if (lastOpenedValue <= 0)
            {
                return total >= MinimumSeriesValue;
            }

            return total >= lastOpenedValue + 1;
        }

        public static bool CanOpenPairs(Meld meld)
        {
            if (!meld.IsValidPairSet())
            {
                return false;
            }

            var pairCount = meld.Tiles.Count / 2;
            return pairCount >= MinimumPairCount;
        }

        public static bool CanDrawFromDiscard(PlayerState player, Tile drawnTile, IEnumerable<Tile> prospectiveMeld, int lastOpenedValue)
        {
            if (player.HasOpenedSeries || player.HasOpenedPairs)
            {
                return true;
            }

            var tiles = prospectiveMeld?.ToList() ?? new List<Tile>();
            tiles.Add(drawnTile);
            var series = new Meld(MeldType.Series, tiles);
            var pairs = new Meld(MeldType.PairSet, tiles);

            return CanOpenSeries(series, lastOpenedValue) || CanOpenPairs(pairs);
        }
    }
}