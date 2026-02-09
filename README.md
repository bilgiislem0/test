# 51plus (Unity)

This repository contains the initial Unity C# core for the 51plus (51 Okey) game.

## Current scope
- Core data model (tiles, players, game state)
- Deck generation and shuffle
- Basic rule helpers (series/pair validation, value totals)

## Next steps
- Unity scene + UI bindings
- Turn system, draw/discard flow
- Online room synchronization

## Scripts
- Assets/Scripts/Model/Tile.cs
- Assets/Scripts/Model/Meld.cs
- Assets/Scripts/Model/PlayerState.cs
- Assets/Scripts/Game/Deck.cs
- Assets/Scripts/Game/GameState.cs
- Assets/Scripts/Game/RuleEngine.cs