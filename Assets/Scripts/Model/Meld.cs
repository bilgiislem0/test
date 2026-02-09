using System;
using System.Collections.Generic;
using System.Linq;

namespace FiftyOnePlus.Model
{
    public enum MeldType
    {
        Series,
        PairSet
    }

    [Serializable]
    public sealed class Meld
    {
        public MeldType Type { get; }
        public List<Tile> Tiles { get; }

        public Meld(MeldType type, IEnumerable<Tile> tiles)
        {
            Type = type;
            Tiles = tiles?.ToList() ?? throw new ArgumentNullException(nameof(tiles));
        }

        public int TotalValue => Tiles.Sum(tile => tile.Value);

        public bool IsValidSeries()
        {
            if (Tiles.Count < 3)
            {
                return false;
            }

            if (Tiles.Any(tile => tile.IsJoker))
            {
                return false;
            }

            var distinctColors = Tiles.Select(tile => tile.Color).Distinct().ToList();
            if (distinctColors.Count != 1)
            {
                return false;
            }

            var ordered = Tiles.Select(tile => tile.Number).OrderBy(number => number).ToList();
            for (var i = 1; i < ordered.Count; i++)
            {
                if (ordered[i] != ordered[i - 1] + 1)
                {
                    return false;
                }
            }

            return true;
        }

        public bool IsValidPairSet()
        {
            if (Tiles.Count < 2 || Tiles.Count % 2 != 0)
            {
                return false;
            }

            if (Tiles.Any(tile => tile.IsJoker))
            {
                return false;
            }

            var grouped = Tiles.GroupBy(tile => new { tile.Color, tile.Number }).ToList();
            return grouped.All(group => group.Count() == 2);
        }
    }
}