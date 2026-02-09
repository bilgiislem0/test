using System;
using System.Collections.Generic;
using FiftyOnePlus.Model;

namespace FiftyOnePlus.Game
{
    public enum DrawSource
    {
        Stock,
        Discard
    }

    public sealed class TurnFlow
    {
        private readonly GameState _state;
        private bool _hasDrawn;

        public TurnFlow(GameState state)
        {
            _state = state ?? throw new ArgumentNullException(nameof(state));
        }

        public PlayerState CurrentPlayer => _state.CurrentPlayer;
        public bool HasDrawn => _hasDrawn;

        public Tile Draw(DrawSource source)
        {
            if (_hasDrawn)
            {
                throw new InvalidOperationException("Player already drew a tile this turn.");
            }

            Tile tile = source == DrawSource.Stock ? _state.DrawFromStock() : _state.DrawFromDiscard();
            if (tile == null)
            {
                return null;
            }

            _hasDrawn = true;
            return tile;
        }

        public bool Discard(Tile tile)
        {
            if (!_hasDrawn)
            {
                throw new InvalidOperationException("Player must draw before discarding.");
            }

            var success = _state.Discard(tile);
            if (success)
            {
                _hasDrawn = false;
            }

            return success;
        }

        public bool OpenSeries(Meld meld)
        {
            if (!_hasDrawn)
            {
                throw new InvalidOperationException("Player must draw before opening.");
            }

            if (!RuleEngine.CanOpenSeries(meld, _state.LastOpenedSeriesValue))
            {
                return false;
            }

            _state.AddOpenSeries(meld);
            RemoveFromHand(meld.Tiles);
            return true;
        }

        public bool OpenPairs(Meld meld)
        {
            if (!_hasDrawn)
            {
                throw new InvalidOperationException("Player must draw before opening.");
            }

            if (!RuleEngine.CanOpenPairs(meld))
            {
                return false;
            }

            _state.AddOpenPairs(meld);
            RemoveFromHand(meld.Tiles);
            return true;
        }

        private void RemoveFromHand(IEnumerable<Tile> tiles)
        {
            foreach (var tile in tiles)
            {
                _state.CurrentPlayer.RemoveTile(tile);
            }
        }
    }
}