from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from Model import FirstLayerDMM
from Chatbot import handle_general_query
from RealTimeSearchEngine import handle_realtime_query
import logging
import time

# Initialize app and logger
app = FastAPI()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("api")

# Request schema
class QueryRequest(BaseModel):
    query: str

# Response schema
class QueryResponse(BaseModel):
    type: str
    response: str

@app.get("/")
def read_root():
    return {"message": "Hello 🌟 FastAPI is running successfully!"}

@app.post("/query/", response_model=QueryResponse)
def handle_query(req: QueryRequest):
    query = req.query.strip()

    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    start_time = time.time()

    try:
        decision = FirstLayerDMM(prompt=query)
        logger.info(f"Decision: {decision} | Time: {time.time() - start_time:.2f}s")

        if not decision or not decision[0]:
            return QueryResponse(type="unknown", response="Couldn't determine the query type.")

        parts = decision[0].split(maxsplit=1)
        task_type = parts[0].lower()
        refined_query = parts[1] if len(parts) > 1 else ""

        if task_type == "general":
            response = handle_general_query(refined_query)
            logger.info(f"Handled general query in {time.time() - start_time:.2f}s")
            return QueryResponse(type="general", response=response)

        elif task_type == "realtime":
            response = handle_realtime_query(refined_query)
            logger.info(f"Handled realtime query in {time.time() - start_time:.2f}s")
            return QueryResponse(type="realtime", response=response)

        else:
            return QueryResponse(type="unsupported", response=f"The query type '{task_type}' is not supported yet.")

    except Exception as e:
        logger.error(f"Error handling query: {e}")
        return QueryResponse(type="error", response=f"An error occurred: {str(e)}")
