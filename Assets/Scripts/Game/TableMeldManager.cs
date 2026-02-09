using System;
using System.Collections.Generic;
using System.Linq;
using FiftyOnePlus.Model;

namespace FiftyOnePlus.Game
{
    public sealed class TableMeldManager
    {
        private readonly GameState _state;

        public TableMeldManager(GameState state)
        {
            _state = state ?? throw new ArgumentNullException(nameof(state));
        }

        public IReadOnlyList<Meld> OpenSeries => _state.OpenSeries;
        public IReadOnlyList<Meld> OpenPairs => _state.OpenPairs;

        public bool TryExtendSeries(Meld target, Tile tile)
        {
            if (target == null || tile == null)
            {
                return false;
            }

            if (!OpenSeries.Contains(target))
            {
                return false;
            }

            if (tile.IsJoker || target.Tiles.Any(existing => existing.IsJoker))
            {
                return false;
            }

            var color = target.Tiles.First().Color;
            if (tile.Color != color)
            {
                return false;
            }

            var ordered = target.Tiles.Select(existing => existing.Number).OrderBy(number => number).ToList();
            var min = ordered.First();
            var max = ordered.Last();

            if (tile.Number == min - 1 || tile.Number == max + 1)
            {
                target.Tiles.Add(tile);
                return true;
            }

            return false;
        }

        public bool TryExtendPairSet(Meld target, Tile tile)
        {
            if (target == null || tile == null)
            {
                return false;
            }

            if (!OpenPairs.Contains(target))
            {
                return false;
            }

            if (tile.IsJoker || target.Tiles.Any(existing => existing.IsJoker))
            {
                return false;
            }

            var matchingCount = target.Tiles.Count(existing => existing.Color == tile.Color && existing.Number == tile.Number);
            if (matchingCount >= 2)
            {
                return false;
            }

            target.Tiles.Add(tile);
            return true;
        }

        public void RemoveFromPlayerHand(PlayerState player, IEnumerable<Tile> tiles)
        {
            if (player == null || tiles == null)
            {
                return;
            }

            foreach (var tile in tiles)
            {
                player.RemoveTile(tile);
            }
        }
    }
}