using System;

namespace FiftyOnePlus.Model
{
    public enum TileColor
    {
        Red,
        Blue,
        Black,
        Yellow
    }

    [Serializable]
    public sealed class Tile : IEquatable<Tile>
    {
        public TileColor Color { get; }
        public int Number { get; }
        public bool IsJoker { get; }
        public bool IsOkey { get; set; }

        public int Value => IsJoker ? 0 : Number;

        public Tile(TileColor color, int number, bool isJoker = false)
        {
            if (!isJoker && (number < 1 || number > 13))
            {
                throw new ArgumentOutOfRangeException(nameof(number), "Tile number must be between 1 and 13.");
            }

            Color = color;
            Number = number;
            IsJoker = isJoker;
        }

        public override string ToString()
        {
            return IsJoker ? "Joker" : $"{Color}-{Number}";
        }

        public bool Equals(Tile other)
        {
            if (other is null)
            {
                return false;
            }

            return Color == other.Color && Number == other.Number && IsJoker == other.IsJoker;
        }

        public override bool Equals(object obj)
        {
            return Equals(obj as Tile);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Color, Number, IsJoker);
        }

        public static bool operator ==(Tile left, Tile right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(Tile left, Tile right)
        {
            return !Equals(left, right);
        }
    }
}