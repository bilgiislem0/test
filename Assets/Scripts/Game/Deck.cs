using System;
using System.Collections.Generic;
using System.Linq;
using FiftyOnePlus.Model;

namespace FiftyOnePlus.Game
{
    public sealed class Deck
    {
        private readonly List<Tile> _tiles;
        private readonly Random _random = new();

        public Deck()
        {
            _tiles = BuildDeck();
            Shuffle();
        }

        public int Count => _tiles.Count;

        public Tile Draw()
        {
            if (_tiles.Count == 0)
            {
                return null;
            }

            var tile = _tiles[^1];
            _tiles.RemoveAt(_tiles.Count - 1);
            return tile;
        }

        public void Shuffle()
        {
            for (var i = _tiles.Count - 1; i > 0; i--)
            {
                var swapIndex = _random.Next(i + 1);
                (_tiles[i], _tiles[swapIndex]) = (_tiles[swapIndex], _tiles[i]);
            }
        }

        private static List<Tile> BuildDeck()
        {
            var tiles = new List<Tile>();
            foreach (TileColor color in Enum.GetValues(typeof(TileColor)))
            {
                for (var set = 0; set < 2; set++)
                {
                    for (var number = 1; number <= 13; number++)
                    {
                        tiles.Add(new Tile(color, number));
                    }
                }
            }

            tiles.Add(new Tile(TileColor.Red, 0, isJoker: true));
            tiles.Add(new Tile(TileColor.Blue, 0, isJoker: true));

            return tiles;
        }
    }
}