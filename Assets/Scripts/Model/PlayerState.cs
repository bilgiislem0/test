using System.Collections.Generic;
using System.Linq;

namespace FiftyOnePlus.Model
{
    public sealed class PlayerState
    {
        public PlayerState(string name)
        {
            Name = name;
        }

        public string Name { get; }
        public List<Tile> Hand { get; } = new();
        public bool HasOpenedSeries { get; set; }
        public bool HasOpenedPairs { get; set; }

        public void AddTile(Tile tile)
        {
            Hand.Add(tile);
        }

        public bool RemoveTile(Tile tile)
        {
            return Hand.Remove(tile);
        }

        public int TotalHandValue()
        {
            return Hand.Sum(tile => tile.Value);
        }
    }
}