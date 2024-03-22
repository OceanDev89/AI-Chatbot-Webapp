import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatbotUIContext } from "@/context/context"
import { Tables } from "@/supabase/types"
import { FC, useContext, useState } from "react"
import { Message } from "../messages/message"

interface ChatMessagesProps {
  workspaceId: string
  assistants: Tables<"assistants">[]
  profile: Tables<"profiles">
  files: Tables<"files">[]
  models: Tables<"models">[]
}

export const ChatMessages: FC<ChatMessagesProps> = ({
  workspaceId,
  assistants,
  profile,
  files,
  models
}) => {
  const { chatMessages, chatFileItems } = useContext(ChatbotUIContext)

  const { handleSendEdit } = useChatHandler({
    workspaceId,
    profile,
    models
  })

  const [editingMessage, setEditingMessage] = useState<Tables<"messages">>()

  return chatMessages
    .sort((a, b) => a.message.sequence_number - b.message.sequence_number)
    .map((chatMessage, index, array) => {
      const messageFileItems = chatFileItems.filter(
        (chatFileItem, _, self) =>
          chatMessage.fileItems.includes(chatFileItem.id) &&
          self.findIndex(item => item.id === chatFileItem.id) === _
      )

      return (
        <Message
          key={chatMessage.message.sequence_number}
          workspaceId={workspaceId}
          assistants={assistants}
          profile={profile}
          files={files}
          models={models}
          message={chatMessage.message}
          fileItems={messageFileItems}
          isEditing={editingMessage?.id === chatMessage.message.id}
          isLast={index === array.length - 1}
          onStartEdit={setEditingMessage}
          onCancelEdit={() => setEditingMessage(undefined)}
          onSubmitEdit={handleSendEdit}
        />
      )
    })
}
