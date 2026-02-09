using System;
using System.Collections.Generic;
using System.Linq;

namespace FiftyOnePlus.Model
{
    [Serializable]
    public sealed class PlayerState
    {
        public string PlayerId { get; }
        public string DisplayName { get; }
        public List<Tile> Hand { get; } = new();
        public bool HasOpenedSeries { get; set; }
        public bool HasOpenedPairs { get; set; }
        public int TotalPenaltyPoints { get; set; }

        public PlayerState(string playerId, string displayName)
        {
            PlayerId = playerId;
            DisplayName = displayName;
        }

        public int HandValue => Hand.Sum(tile => tile.Value);

        public void AddTile(Tile tile)
        {
            if (tile == null)
            {
                throw new ArgumentNullException(nameof(tile));
            }

            Hand.Add(tile);
        }

        public bool RemoveTile(Tile tile)
        {
            return Hand.Remove(tile);
        }
    }
}