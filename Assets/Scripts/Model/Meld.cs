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
        public IReadOnlyList<Tile> Tiles => _tiles;

        private readonly List<Tile> _tiles = new();

        public Meld(MeldType type, IEnumerable<Tile> tiles)
        {
            Type = type;
            _tiles = tiles?.ToList() ?? throw new ArgumentNullException(nameof(tiles));
        }

        public int TotalValue => _tiles.Sum(tile => tile.Value);

        public bool IsValidSeries()
        {
            if (Type != MeldType.Series || _tiles.Count < 3)
            {
                return false;
            }

            var ordered = _tiles.Where(tile => !tile.IsJoker)
                .OrderBy(tile => tile.Number)
                .ToList();

            if (!ordered.Any())
            {
                return false;
            }

            var color = ordered.First().Color;
            if (ordered.Any(tile => tile.Color != color))
            {
                return false;
            }

            for (var i = 1; i < ordered.Count; i++)
            {
                var expected = ordered[i - 1].Number + 1;
                if (ordered[i].Number != expected)
                {
                    return false;
                }
            }

            return true;
        }

        public bool IsValidPairSet()
        {
            if (Type != MeldType.PairSet || _tiles.Count < 8 || _tiles.Count % 2 != 0)
            {
                return false;
            }

            var pairs = _tiles.GroupBy(tile => tile.Number).ToList();
            if (pairs.Any(group => group.Count() != 2))
            {
                return false;
            }

            return pairs.Count >= 4;
        }
    }
}