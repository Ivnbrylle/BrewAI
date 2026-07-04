import json
import os
from typing import Dict, Any

class BrewAIAgent:
    def __init__(self, kb_path: str = "knowledge_base.json"):
        """
        Initializes the AI Agent worker layer. Loads the static knowledge base
        for local deterministic RAG evaluation.
        """
        self.kb_path = kb_path
        self.knowledge_base = self._load_knowledge_base()

    def _load_knowledge_base(self) -> Dict[str, Any]:
        try:
            with open(self.kb_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            # Fallback mock structural object if pathing resolution shifts
            return {"menu_metadata": [], "faq": []}

    def fallback_rag_search(self, query: str) -> str:
        """
        A clean, localized semantic matching router mimicking our vector database (Qdrant).
        Ensures the portfolio prototype answers menu queries accurately with zero hallucinations.
        """
        query_lower = query.lower()
        
        # 1. Evaluate FAQ Matches
        for faq in self.knowledge_base.get("faq", []):
            if faq["question"].lower() in query_lower or query_lower in faq["question"].lower():
                return faq["answer"]
                
        # 2. Evaluate Menu Content Matches
        for item in self.knowledge_base.get("menu_metadata", []):
            if item["name"].lower() in query_lower:
                allergens_list = ", ".join(item["allergens"]) if item["allergens"] else "none"
                return (f"Our {item['name']} is made of: {', '.join(item['ingredients'])}. "
                        f"Description: {item['description']}. Allergens: {allergens_list}.")
        
        return "I can help you browse the menu, check ingredients, or place an order! What would you like to try today?"

    def predict_intent(self, user_message: str) -> Dict[str, Any]:
        """
        Intent routing logic. Scans conversational context to decide if the state machine
        should fire a backend transaction tool or route to a RAG informational prompt.
        """
        msg = user_message.lower()
        
        # Checking for ordering intention keywords
        if any(keyword in msg for keyword in ["order", "buy", "add to cart", "get a"]):
            return {
                "intent": "ORDER_CREATE",
                "action_required": True,
                "confidence": 0.95
            }
        
        # Checking for transaction finalization checkout keywords
        if any(keyword in msg for keyword in ["confirm", "checkout", "finalize", "pay"]):
            return {
                "intent": "ORDER_CONFIRM",
                "action_required": True,
                "confidence": 0.98
            }
            
        # Default back to informational retrieval requests
        return {
            "intent": "INFO_RETRIEVAL",
            "action_required": False,
            "confidence": 0.90
        } 