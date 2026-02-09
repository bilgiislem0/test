using System;
using System.Collections.Generic;
using System.Linq;
using FiftyOnePlus.Model;

namespace FiftyOnePlus.Game
{
    public sealed class GameState
    {
        public List<PlayerState> Players { get; } = new();
        public List<Meld> OpenSeries { get; } = new();
        public List<Meld> OpenPairs { get; } = new();
        public List<Tile> DiscardPile { get; } = new();
        public Deck Deck { get; private set; }
        public int CurrentPlayerIndex { get; private set; }
        public int LastOpenedSeriesValue { get; set; }

        public PlayerState CurrentPlayer => Players[CurrentPlayerIndex];

        public void Initialize(IEnumerable<PlayerState> players)
        {
            Players.Clear();
            Players.AddRange(players);
            Deck = new Deck();
            DiscardPile.Clear();
            OpenSeries.Clear();
            OpenPairs.Clear();
            LastOpenedSeriesValue = 0;

            DealStartingHands();
            CurrentPlayerIndex = 0;
        }

        public Tile DrawFromStock()
        {
            var tile = Deck.Draw();
            if (tile != null)
            {
                CurrentPlayer.AddTile(tile);
            }

            return tile;
        }

        public Tile DrawFromDiscard()
        {
            if (!DiscardPile.Any())
            {
                return null;
            }

            var tile = DiscardPile[^1];
            DiscardPile.RemoveAt(DiscardPile.Count - 1);
            CurrentPlayer.AddTile(tile);
            return tile;
        }

        public bool Discard(Tile tile)
        {
            if (!CurrentPlayer.RemoveTile(tile))
            {
                return false;
            }

            DiscardPile.Add(tile);
            AdvanceTurn();
            return true;
        }

        public void AddOpenSeries(Meld meld)
        {
            OpenSeries.Add(meld);
            LastOpenedSeriesValue = meld.TotalValue;
            CurrentPlayer.HasOpenedSeries = true;
        }

        public void AddOpenPairs(Meld meld)
        {
            OpenPairs.Add(meld);
            CurrentPlayer.HasOpenedPairs = true;
        }

        public void AdvanceTurn()
        {
            CurrentPlayerIndex = (CurrentPlayerIndex + 1) % Players.Count;
        }

        private void DealStartingHands()
        {
            if (Players.Count == 0)
            {
                return;
            }

            for (var i = 0; i < Players.Count; i++)
            {
                var drawCount = i == 0 ? 15 : 14;
                for (var j = 0; j < drawCount; j++)
                {
                    var tile = Deck.Draw();
                    if (tile != null)
                    {
                        Players[i].AddTile(tile);
                    }
                }
            }
        }
    }
}